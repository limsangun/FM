package com.biz.fm.controller;

import org.apache.ibatis.javassist.NotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.biz.fm.domain.dto.EmailPasswordValicationDto.SendMail;
import com.biz.fm.domain.dto.EmailPasswordValicationDto.UpdatePassword;
import com.biz.fm.domain.dto.MemberDto.MemberResponse;
import com.biz.fm.service.ValidationService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;

@Api(tags = {"9. Validation"})
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/validation")
@CrossOrigin
public class ValidationController {

	private final ValidationService validationService;
	
	@GetMapping("/sign-up/check-code")
	@ApiOperation(value = "이메일에 전송된 인증 코드 조회", notes = "전송된 인증 코드를 사용해 유효한 이메일인지 확인한다.")
	public ResponseEntity<?> checkCode(
			@ApiParam(value = "이메일", required = true) @RequestParam String email, 
			@ApiParam(value = "인증코드", required = true) @RequestParam String code ) throws NotFoundException {

		boolean result = validationService.checkCode(email, code);
		return ResponseEntity.ok(result);
	} 
	
	@PostMapping("/sign-up/send-code")
	@ApiOperation(value = "회원가입 시, 인증 코드 이메일 전송", notes = "회원가입 시, 이메일 인증을 위한 인증 코드를 이메일로 전송한다.")
	public ResponseEntity<?> emailValidationForSignUp(
			@ApiParam(value = "인증 이메일", required = true) @RequestBody SendMail sendMail) throws Exception {

		boolean result = validationService.sendToEmailForSignUp(sendMail);
		return ResponseEntity.ok(result);
	}
	
	@PostMapping("/lose-password/send-code")
	@ApiOperation(value = "비밀번호 분실 or 변경 시, 인증 코드 이메일 전송", notes = "비밀번호 분실 or 변경 시, 이메일 인증을 위한 코드를 이메일로 전송한다.")
	public ResponseEntity<?> emailAndNameValidationForPassword(
			@ApiParam(value = "인증 정보", required = true) @RequestBody SendMail sendMail) throws Exception{

		boolean result = validationService.sendToEmailForPassword(sendMail);
		return ResponseEntity.ok(result);
	}
	
	@PutMapping("/password")
	@ApiOperation(value = "비밀번호 변경", notes = "이메일을 Member 테이블에서 조회 후, 문제가 없다면 해당 비밀번호를 변경한다.")
	public ResponseEntity<?> changePasswordCaseOfLoss(
			@ApiParam(value = "비밀번호 변경 정보", required = true) @RequestBody UpdatePassword updatePassword) throws NotFoundException {

		MemberResponse memberResponse = validationService.changePassword(updatePassword);
		return ResponseEntity.ok(memberResponse);
	}
}













