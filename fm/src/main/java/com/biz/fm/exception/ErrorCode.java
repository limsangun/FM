package com.biz.fm.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;

@Getter
public enum ErrorCode {
	//COMMON
	INTERNAL_SERVER_ERROR(HttpStatus.BAD_REQUEST, "C001", ""),
	METHOD_NOT_ALLOW(HttpStatus.METHOD_NOT_ALLOWED, "C002", "Method Not Allowed"),
	NOT_FOUND(HttpStatus.NOT_FOUND, "C003", "Not Found"),
	INSERT_FAIL(HttpStatus.BAD_REQUEST, "C004", "Insert Fail"),
	UPDATE_FAIL(HttpStatus.BAD_REQUEST, "C005", "Update Fail"),
	DELETE_FAIL(HttpStatus.BAD_REQUEST, "C006", "Delete Fail"),
	ARGUMENT_INVALID(HttpStatus.BAD_REQUEST, "C007", "Argument Invalid"),
	MYSQL_QUERY_FAIL(HttpStatus.BAD_REQUEST, "C008", "Datebase Query Fail"),
	
	//Member
	EMAIL_DUPLICATION(HttpStatus.BAD_REQUEST, "M001", "Email is Duplication"),
	DATE_PARSE(HttpStatus.BAD_REQUEST, "M002", "Date format Exception"),
	INVALID_PASSWORD(HttpStatus.BAD_REQUEST, "M003", "Invalid Password"),
	INVALID_EMAIL(HttpStatus.BAD_REQUEST, "M004", "Invalid Email"),
	INVALID_ID(HttpStatus.BAD_REQUEST, "M005", "Invalid Id"),
	
	//File
	FILE_UPLOAD_FAIL(HttpStatus.BAD_REQUEST, "F001", "File Upload Fail"),
	
	//Application
	APPLICATRION_NAME_DUPLICATION(HttpStatus.BAD_REQUEST, "A001", "Application Name is Duplication"),
	
	//UNAUTHORIZED : 클라이언트가 인증되지 않았다.
	//FORBIDDEN : 클라이언트가 인증 되었지만, 권한이 없다. 
	
	//Token
	NOTCORRECT_JWT(HttpStatus.BAD_REQUEST, "T001", "토큰이 올바르게 구성되지 않았습니다. 토큰 값을 다시 한번 확인해주세요."),
	FORBIDDEN_EXCEPTION(HttpStatus.FORBIDDEN, "T002","해당 요청에 대한 권한이 없습니다."),
	EXPIRED_JWT_EXCEPTION(HttpStatus.FORBIDDEN, "T003", "기존 토큰이 만료되었습니다. 해당 토큰을 가지고 토큰 재발급 링크로 이동해주세요."),
	RELOGIN(HttpStatus.FORBIDDEN, "T004","모든 토큰이 만료되었습니다. 다시 로그인해주세요."),
	BAD_TOKEN(HttpStatus.BAD_REQUEST, "T005", "잘못된 경로로 발생된 토큰입니다."),
    LOGOUT_BY_STATE_LOGIN(HttpStatus.BAD_REQUEST, "T006", "로그인 상태입니다. 로그아웃 해주세요."),
    LOGOUT_BY_BAD_TOKEN(HttpStatus.BAD_REQUEST, "T007", "잘못된 경로로 발생된 토큰입니다. 다시 로그인 해주세요."),
    APP_BY_BAD_TOKEN(HttpStatus.BAD_REQUEST, "T008", "잘못된 경로로 발생된 토큰입니다. 앱을 토큰을 다시 발급 받아주세요."),
    ILLEGAL_ARGUMENT_EXCEPTION(HttpStatus.BAD_REQUEST, "T009", "메소드가 잘못되었거나 부적절한 인자를 메서드로 넘겨주었습니다."),
    ISSUED_TOKEN(HttpStatus.UNAUTHORIZED, "T010", "토큰이 발급되어있지 않습니다. 먼저 토큰을 발급 해주세요."),
//  NO_SIGNATURE_JWT(HttpStatus.BAD_REQUEST, "T011", "토큰에서 기존 서명을 확인하지 못했습니다. 토큰 값을 다시 한번 확인해주세요.")
//	UNEXPECTED_JWT(HttpStatus.BAD_REQUEST, "T005", "예상하는 형식과 일치하지 않는 특정 형식이나 구성의 토큰입니다. 토큰 값을 다시 한번 확인해주세요."),
	;
	
	private final HttpStatus status;
	private final String code;
	private final String message;
	
	private ErrorCode(final HttpStatus status, final String code, final String message) {
		this.status = status;
		this.code = code;
		this.message = message;
	}
}
