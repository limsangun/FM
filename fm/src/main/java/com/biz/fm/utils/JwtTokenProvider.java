package com.biz.fm.utils;

import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.biz.fm.domain.dto.SignDto.SignIn;
import com.biz.fm.domain.entity.AppToken;
import com.biz.fm.domain.entity.LoginToken;
import com.biz.fm.repository.AppTokenRepository;
import com.biz.fm.repository.LoginTokenRepository;
import com.biz.fm.service.CustomUserDetailService;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtTokenProvider { // JWT 토큰을 생성 및 검증 모듈

	private final CustomUserDetailService userDetailsService;
	private final AppTokenRepository appTokenRepository;
	private final LoginTokenRepository loginTokenRepository;

	private String secretKey = "govlepel@$&";

	private final long accessExpireTime = 60 * 60 * 1000L; 		// 1시간
	private final long refreshExpireTime = 60 * 60 * 48000L; 	// 2일

	// 객체 초기화, secretKey를 Base64로 인코딩한다.
	@PostConstruct
	protected void init() {
		secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
	}

	// Guest Access 토큰 생성
	public Map<String, String> GuestCreateAccessToken(SignIn signInfo) {
		Map<String, Object> payloads = new HashMap<>();
		payloads.put("email", signInfo.getEmail());
		payloads.put("type", "guestAccess");
		payloads.put("role", "ROLE_GUEST");

		Map<String, String> jwtResult = jwtBuild(payloads, null, "accessToken");
		return jwtResult;
	}

	// SignIn Access 
	public Map<String, String> SignInCreateAccessToken(SignIn signInfo) {
		Map<String, Object> payloads = new HashMap<>();
		payloads.put("email", signInfo.getEmail());
		payloads.put("type", "loginAccess");
		payloads.put("role", "ROLE_USER");

		Date expiration = new Date();
		expiration.setTime(expiration.getTime() + accessExpireTime);

		Map<String, String> jwtResult = jwtBuild(payloads, expiration, "accessToken");
		return jwtResult;
	}

	// SignIn Refresh 
	public Map<String, String> SignInCreateRefreshToken(SignIn signInfo) {
		Map<String, Object> payloads = new HashMap<>();
		payloads.put("email", signInfo.getEmail());
		payloads.put("type", "loginRefresh");

		Date expiration = new Date();
		expiration.setTime(expiration.getTime() + refreshExpireTime);

		Map<String, String> jwtResult = jwtBuild(payloads, expiration, "refreshToken");
		return jwtResult;
	}

	// App Access
	public Map<String, String> ApiAuthCreateAccessToken(String appId, String email) {
		Map<String, Object> payloads = new HashMap<>();
		payloads.put("appId", appId);
		payloads.put("email", email);
		payloads.put("type", "appAccess");
		payloads.put("role", "ROLE_USER,ROLE_DEVELOPER");

		Date expiration = new Date();
		expiration.setTime(expiration.getTime() + accessExpireTime);

		Map<String, String> jwtResult = jwtBuild(payloads, expiration, "accessToken");
		return jwtResult;
	}

	// Jwt 토큰 내용 정의
	public Map<String, String> jwtBuild(Map<String, Object> payloads, Date expiration, String type) {
		String jwt = Jwts
						.builder()
						.setClaims(payloads)							// 정보저장
						.setExpiration(expiration)						// set Expire Time
						.signWith(SignatureAlgorithm.HS256, secretKey)	// 암호화 알고리즘, secret값 세팅
						.compact();
		
		Map<String, String> result = new HashMap<>();
		if(type.equals("accessToken")) result.put("accessToken", jwt);
		else if(type.equals("refreshToken")) result.put("refreshToken", jwt);
		
		return result;
	}
	
	// Jwt 토큰으로 인증 정보를 조회 : email
	public Authentication getAuthentication(String token) {
		String tokenType = this.getUserInfo(token, "type");
		
		if(tokenType.equals("loginAccess")) {	  		// USER 토큰
			UserDetails userDetails = userDetailsService.loadUserByUsername(this.getUserInfo(token, "email"));
			if (userDetails == null) return null;
			
			List<GrantedAuthority> updatedAuthorities = new ArrayList<>(userDetails.getAuthorities());
			if(updatedAuthorities.size() > 1) updatedAuthorities.remove(1);
			return new UsernamePasswordAuthenticationToken(userDetails, "", updatedAuthorities);

		} else if(tokenType.equals("appAccess")) {		// DEVELOPER 토큰
			UserDetails userDetails = userDetailsService.loadUserByUsername(this.getUserInfo(token, "email"));
			if (userDetails == null) return null;
			
			List<GrantedAuthority> updatedAuthorities = new ArrayList<>(userDetails.getAuthorities());
			updatedAuthorities.remove(0);
			return new UsernamePasswordAuthenticationToken(userDetails, "", updatedAuthorities);
	
		} else if(tokenType.equals("guestAccess")) {	// GUEST 토큰
			GuestAuthority guestAuthority = new GuestAuthority();
			List<GrantedAuthority> updatedAuthorities = new ArrayList<>();
			updatedAuthorities.add(guestAuthority);
			return new UsernamePasswordAuthenticationToken("", "", updatedAuthorities);
		}
		return null;
	}

	// Jwt 토큰에서 회원 구별 정보 추출
	public String getUserInfo(String token, String type) {
		return (String) Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody().get(type);
	}

	// Request의 Header에서 token 파싱 : "Authorization: 로그인 jwt토큰"
	public String resolveToken(HttpServletRequest req) {
		String authorization = req.getHeader("Authorization");
		if(authorization == null) return authorization;
		else {
			String beararAuthorization = authorization.substring(authorization.lastIndexOf(" ") + 1);
			return beararAuthorization;
		}
	}
	
	// Jwt 토큰의 유효성 + 만료일자 확인
	public boolean validateToken(ServletRequest request, String authToken) {
		try {
			// JWT 토큰 secretKey, 토큰 형식 검증
			String type = this.getUserInfo(authToken, "type");
			if (type == null) return false;
			
			// API 요청시 유효한 AccessToken 인지 검증
			if (type.equals("loginAccess")) {
				LoginToken loginToken = loginTokenRepository.findByAccessToken(authToken);
				if (loginToken == null)
					return false;
			} else if (type.equals("appAccess")) {
				AppToken appToken = appTokenRepository.findByAccessToken(authToken);
				if (appToken == null)
					return false;
			} 

			// 토큰 재발급 시 유효한 RefreshToken 인지 검증
			if (type.equals("loginRefresh")) {
				LoginToken loginToken = loginTokenRepository.findByRefreshToken(authToken);
				if (loginToken == null)
					return false;
			} 
			return true;

		} catch (MalformedJwtException e) {		// JWT가 올바르게 구성되지 않았을 때
			request.setAttribute("exception", "NotCorrectJwt");
		} catch (ExpiredJwtException e) { 		// JWT를 생성할 때 지정한 유효기간 초과할 때.
			request.setAttribute("exception", "ExpiredJwtException");
		} catch (UnsupportedJwtException e) {   // 예상하는 형식과 일치하지 않는 특정 형식이나 구성의 JWT일 때
			request.setAttribute("exception", "NotCorrectJwt");
		} catch (IllegalArgumentException e) {  // 메소드가 잘못되었거나 부적합한 인수를 전달했음을 나타내기 위해
			request.setAttribute("exception", "IllegalArgumentException");
		} catch (SignatureException e) { 		// JWT의 기존 서명을 확인하지 못했을 때
			request.setAttribute("exception", "NotCorrectJwt");
		}
		return false;
	}
}