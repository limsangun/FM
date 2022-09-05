package com.biz.fm.service;

import java.text.ParseException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;

import org.apache.ibatis.javassist.NotFoundException;
import org.springframework.stereotype.Service;

import com.biz.fm.domain.dto.AppTokenDto.AppTokenPublish;
import com.biz.fm.domain.dto.AppTokenDto.NewAccessTokenPublish;
import com.biz.fm.domain.dto.AppTokenDto.UpdateInfo;
import com.biz.fm.domain.entity.AppToken;
import com.biz.fm.domain.entity.Application;
import com.biz.fm.domain.entity.Member;
import com.biz.fm.exception.custom.AppByBadToken;
import com.biz.fm.exception.custom.DeleteFailException;
import com.biz.fm.exception.custom.IssudToken;
import com.biz.fm.repository.AppTokenRepository;
import com.biz.fm.repository.ApplicationRepository;
import com.biz.fm.repository.MemberRepository;
import com.biz.fm.utils.JwtTokenProvider;
import com.biz.fm.utils.Role;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ApiAuthService {

	private final JwtTokenProvider jwtTokenProvider;
	private final ApplicationRepository applicationRepository;
	private final AppTokenRepository appTokenRepository;
	private final MemberRepository memberRepository;
	
	public Map<String, String> requestToken(AppTokenPublish appKey, ServletRequest request) throws NotFoundException, ParseException {
		// 유효하지 않은 키 값 정리
		Application app = applicationRepository.findByKey(appKey.getAppKey());
		if (app == null) throw new NotFoundException("유효한 키값이 아닙니다.");
		
		// 이미 토큰이 발급되었다면
		AppToken appToken = appTokenRepository.findByAppId(app.getId());
		if(appToken != null) {
			// 토큰이 만료 되었는지 확인
			boolean tokenValidationCheck = jwtTokenProvider.validateToken(request, appToken.getAccessToken());
			if(!tokenValidationCheck) {
				return createAppToken(app, "update");
			}else if(tokenValidationCheck) {
				int deleteResult = appTokenRepository.delete(appToken.getAppId());
				if(deleteResult > 0) throw new AppByBadToken();
				throw new DeleteFailException();
			}
		} 
		return createAppToken(app, "insert"); 
	}
	
	public Map<String, String> createAppToken(Application app, String type){
		Map<String, String> resultToken = new HashMap<>();
		Member member = memberRepository.findById(app.getMemberId());
		
		String accessToken = jwtTokenProvider.ApiAuthCreateAccessToken(app.getId(), member.getEmail()).get("accessToken");

		// 토큰 데이터베이스에 토큰 정보를 입력하고, 연산
		if(type == "insert") {
			AppToken resultInfo = AppToken
										.builder()
										.appId(app.getId())
										.accessToken(accessToken)
										.build();
			appTokenRepository.insert(resultInfo);
			
			resultToken.put("accessToken", resultInfo.getAccessToken());
		}
		else if(type == "update") {
			UpdateInfo updateInfo =UpdateInfo
										.builder()
										.appId(app.getId())
										.accessToken(accessToken)
										.build();
			appTokenRepository.update(updateInfo);
			
			resultToken.put("accessToken", updateInfo.getAccessToken());
		}
		
		// member role 추가
		memberRepository.updateRole(member.getId(), Role.ROLE_USER.toString() + "," + Role.ROLE_DEVELOPER.toString());

		return resultToken;
	}

	// 새로운 토큰 반환
	public Map<String, String> newAccessToken(NewAccessTokenPublish newAccessToken, HttpServletRequest request)
			throws ParseException {
		
		Application application = applicationRepository.findByKey(newAccessToken.getAppKey());
		if(application == null) throw new IssudToken();
	
		AppToken appTokenByAppId = appTokenRepository.findByAppId(application.getId());
		AppToken appTokenByAccessToken = appTokenRepository.findByAccessToken(newAccessToken.getAccessToken());
		
		// 토큰이 테이블에 정보가 있지 않은 경우, 올바른 요청이 아니다.
		if (appTokenByAppId == null || appTokenByAccessToken == null) throw new IssudToken();

		// AccessToken이 만료되지 않았다면, 잘못된 접근으로 인식 -> 토큰 만료
		if(jwtTokenProvider.validateToken(request, appTokenByAccessToken.getAccessToken())) {
			int deleteResult = appTokenRepository.delete(appTokenByAccessToken.getAppId());
			if(deleteResult > 0) throw new AppByBadToken();
			throw new DeleteFailException();
		}
		
		Member member = memberRepository.findById(application.getMemberId());
		String accessToken = jwtTokenProvider.ApiAuthCreateAccessToken(application.getId(), member.getEmail()).get("accessToken");
		
		UpdateInfo updateInfo =UpdateInfo
									.builder()
									.appId(application.getId())
									.accessToken(accessToken)
									.build();
		appTokenRepository.update(updateInfo);
		
		Map<String, String> result = new HashMap<>();
		result.put("accessToken", updateInfo.getAccessToken());
		
		return result;
	}

}
