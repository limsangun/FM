package com.biz.fm.service;

import java.text.ParseException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.biz.fm.domain.dto.LoginTokenDto.NewAccessToken;
import com.biz.fm.domain.dto.MemberDto.MemberResponse;
import com.biz.fm.domain.dto.MemberDto.MemberUp;
import com.biz.fm.domain.dto.SignDto.SignIn;
import com.biz.fm.domain.dto.SignDto.SignInfo;
import com.biz.fm.domain.dto.SignDto.SignOut;
import com.biz.fm.domain.dto.SignDto.SignUp;
import com.biz.fm.domain.entity.Address;
import com.biz.fm.domain.entity.LoginToken;
import com.biz.fm.domain.entity.Member;
import com.biz.fm.exception.ErrorCode;
import com.biz.fm.exception.custom.BadToken;
import com.biz.fm.exception.custom.EmailDuplicationException;
import com.biz.fm.exception.custom.InsertFailException;
import com.biz.fm.exception.custom.InvalidEmailException;
import com.biz.fm.exception.custom.InvalidPasswordException;
import com.biz.fm.exception.custom.LogoutByBadToken;
import com.biz.fm.exception.custom.ReLogin;
import com.biz.fm.repository.AddressRepository;
import com.biz.fm.repository.LoginTokenRepository;
import com.biz.fm.repository.MemberRepository;
import com.biz.fm.utils.JwtTokenProvider;
import com.biz.fm.utils.Role;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SignService {

	private final MemberRepository memberRepository;
	private final LoginTokenRepository loginTokenRepository;
	private final AddressRepository addressRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtTokenProvider jwtTokenProvider;

	ErrorCode errorCode;
	
	// 회원가입
	public MemberResponse signUp(SignUp signUpinfo) throws ParseException {

		boolean result = this.isDuplicate(signUpinfo.getEmail());
		if (result) throw new EmailDuplicationException();

		Address address = signUpinfo.getAddress();
		address.setId(UUID.randomUUID().toString().replace("-", ""));
		addressRepository.insert(address);

		MemberUp newMember = MemberUp
								.builder()
								.id(UUID.randomUUID().toString().replace("-", ""))
								.name(signUpinfo.getName())
								.email(signUpinfo.getEmail())
								.password(passwordEncoder.encode(signUpinfo.getPassword()))
								.phoneNumber(signUpinfo.getPhoneNumber())
								.birth(signUpinfo.getBirth())
								.role(Role.ROLE_USER)
								.addressId(address.getId())
								.build();

		MemberResponse memberRead = this.insert(newMember);

		return memberRead;
	}

	// Guest 회원가입
//	public MemberResponse signupGuest(SignUp signUpinfo) throws ParseException {
//
//		boolean result = this.isDuplicate(signUpinfo.getEmail());
//		if (result)
//			throw new EmailDuplicationException();
//
//		Address address = signUpinfo.getAddress();
//		address.setId(UUID.randomUUID().toString().replace("-", ""));
//		addressRepository.insert(address);
//
//		MemberUp newMember = MemberUp
//								.builder()
//								.id(UUID.randomUUID().toString().replace("-", ""))
//								.name(signUpinfo.getName())
//								.email(signUpinfo.getEmail())
//								.password(passwordEncoder.encode(signUpinfo.getPassword()))
//								.phoneNumber(signUpinfo.getPhoneNumber())
//								.birth(signUpinfo.getBirth())
//								.role(Role.ROLE_GUEST)
//								.addressId(address.getId())
//								.build();
//
//		MemberResponse memberRead = this.insert(newMember);
//
//		return memberRead;
//	}

	// 로그인
	public SignInfo signIn(SignIn signInInfo, HttpServletRequest request) throws ParseException {

		// 이메일 확인
		Member member = memberRepository.findByEmail(signInInfo.getEmail());
		if (member == null)
			throw new InvalidEmailException();

		// 패스워드를 확인.
		if (!passwordEncoder.matches(signInInfo.getPassword(), member.getPassword()))
			throw new InvalidPasswordException();

		// 토큰을 만들어 반환
		Map<String, String> createToken = createTokenReturn(signInInfo, "login");

		SignInfo signInfo = SignInfo
								.builder()
								.id(member.getId())
								.name(member.getName())
								.accessToken(createToken.get("accessToken"))
								.refreshToken(createToken.get("refreshToken"))
								.build();

		return signInfo;
	}
	
	// Guest 로그인
//	public SignInfo signInGuest(SignIn signInInfo) throws ParseException {
//
//		// 이메일 확인
//		Member member = memberRepository.findByEmail(signInInfo.getEmail());
//		if (member == null)
//			throw new InvalidEmailException();
//
//		// 패스워드를 확인.
//		if (!passwordEncoder.matches(signInInfo.getPassword(), member.getPassword()))
//			throw new InvalidPasswordException();
//
//		// 토큰 이메일 중복 확인.
//		if (loginTokenRepository.findByMemberId(member.getId()) != null)
//			throw new LogoutByStateLogin();
//
//		// 토큰을 만들어 반환
//		Map<String, String> createToken = createTokenReturn(signInInfo, "guest");
//
//		SignInfo signInfo = SignInfo
//								.builder()
//								.id(member.getId())
//								.name(member.getName())
//								.accessToken(createToken.get("accessToken"))
//								.refreshToken(createToken.get("refreshToken"))
//								.build();
//
//		return signInfo;
//		}

	// 로그아웃
	public boolean signOut(SignOut signOut ,ServletRequest request) {
		Member member = memberRepository.findByEmail(signOut.getEmail());
		if (member == null) throw new InvalidEmailException();
		
		LoginToken loginToken = loginTokenRepository.findByAccessToken(signOut.getAccessToken());
		if(loginToken == null)  throw new BadToken();

		int deleteCheck = loginTokenRepository.delete(member.getId());
		if (deleteCheck > 0) return true;
		else return false;
	}
	
	public MemberResponse insert(MemberUp member) {
		member.setId(UUID.randomUUID().toString().replace("-", ""));
		
		int result = memberRepository.insert(member);
		if(result > 0) {
			return memberRepository.findById(member.getId()).toMemberRead();
		}
		else throw new InsertFailException();
	}

	// 새로운 토큰 반환
	public Map<String, String> newAccessToken(NewAccessToken newAccessToken, HttpServletRequest request)
			throws ParseException {

		Map<String, String> result = new HashMap<>();

		LoginToken userToken = loginTokenRepository.findByToken(
													newAccessToken.getAccessToken(),
													newAccessToken.getRefreshToken());

		// 로그아웃의 경우, LogoutByBadToken 예외처리
		if (userToken == null) throw new LogoutByBadToken();

		// AccessToken이 만료되지 않았는데, 재발급 받을 시 잘못된 접근으로 인식한다.
		if(jwtTokenProvider.validateToken(request, userToken.getAccessToken())) {
			Member member = memberRepository.findById(userToken.getMemberId());
			SignOut signOut = SignOut
									.builder()
									.email(member.getEmail())
									.accessToken(userToken.getAccessToken())
									.build();
			this.signOut(signOut, request);
			throw new LogoutByBadToken();
		}
		
		// AccessToken은 만료되었지만 RefreshToken은 만료되지 않은 경우
		if (jwtTokenProvider.validateToken(request, userToken.getRefreshToken())) {
			String email = jwtTokenProvider.getUserInfo(userToken.getRefreshToken(), "email");
			SignIn signIn = new SignIn();
			signIn.setEmail(email);

			// 엑세스 토큰, 리프레쉬 토큰 모두 발급
			Map<String, String> createToken = createTokenReturn(signIn, "newToken");
			result.put("accessToken", createToken.get("accessToken"));
			result.put("refreshToken", createToken.get("refreshToken"));

		// RefreshToken 또한 만료된 경우는 테이블을 날리야 한다.
		} else {
			loginTokenRepository.delete(userToken.getMemberId());
			throw new ReLogin();
		}

		return result;
	}

	// 토큰을 생성해서 반환
	public Map<String, String> createTokenReturn(SignIn SignInfo, String type) throws ParseException {

		Map<String, String> result = new HashMap<String, String>();

		String accessToken = jwtTokenProvider.SignInCreateAccessToken(SignInfo).get("accessToken");
		String refreshToken = jwtTokenProvider.SignInCreateRefreshToken(SignInfo).get("refreshToken");
		Member member = memberRepository.findByEmail(SignInfo.getEmail());

		if (type == "login") {
			LoginToken Token = LoginToken
										.builder()
										.memberId(member.getId())
										.accessToken(accessToken)
										.refreshToken(refreshToken)
										.build();
			
			LoginToken loginToken = loginTokenRepository.findByMemberId(member.getId());
			if(loginToken == null) {
				loginTokenRepository.insert(Token);
			}else if (loginToken != null) {
				loginTokenRepository.update(Token);
			}
			
			result.put("accessToken", Token.getAccessToken());
			result.put("refreshToken", Token.getRefreshToken());

		} else if (type == "newToken") {
			LoginToken updateToken = LoginToken
											.builder()
											.memberId(member.getId())
											.accessToken(accessToken)
											.refreshToken(refreshToken)
											.build();

			loginTokenRepository.update(updateToken);

			result.put("accessToken", updateToken.getAccessToken());
			result.put("refreshToken", updateToken.getRefreshToken());

		} else if (type == "guest") {
			String guestAccessToken = jwtTokenProvider.GuestCreateAccessToken(SignInfo).get("accessToken");
			LoginToken insertToken = LoginToken
											.builder()
											.memberId(member.getId())
											.accessToken(guestAccessToken)
											.refreshToken(null)
											.build();

			loginTokenRepository.insert(insertToken);

			result.put("accessToken", guestAccessToken);
			result.put("refreshToken", null);

		}
		return result;
	}

	// 중복 확인
	public boolean isDuplicate(String email) {
		Member member = memberRepository.findByEmail(email);
		if (member == null) return false;
		else return true;
	}

	// 패스워드 확인
	public boolean isPassword(SignIn signInInfo) {
		Member beforeMember = memberRepository.findByEmail(signInInfo.getEmail());
		if (beforeMember == null) throw new InvalidEmailException();

		boolean checkPassword = passwordEncoder.matches(beforeMember.getPassword(), signInInfo.getPassword());

		if (checkPassword) return true;
		else return false;
	}

}
