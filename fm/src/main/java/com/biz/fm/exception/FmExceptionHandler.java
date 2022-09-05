package com.biz.fm.exception;

import java.sql.SQLException;
import java.text.ParseException;
import java.util.HashMap;
import java.util.Map;

import javax.validation.ConstraintViolationException;

import org.apache.ibatis.javassist.NotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.UnsatisfiedServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.biz.fm.exception.custom.AppByBadToken;
import com.biz.fm.exception.custom.ApplicationNameDuplicationException;
import com.biz.fm.exception.custom.BadToken;
import com.biz.fm.exception.custom.DeleteFailException;
import com.biz.fm.exception.custom.EmailDuplicationException;
import com.biz.fm.exception.custom.FileUploadFailException;
import com.biz.fm.exception.custom.InsertFailException;
import com.biz.fm.exception.custom.InvalidEmailException;
import com.biz.fm.exception.custom.InvalidPasswordException;
import com.biz.fm.exception.custom.IssudToken;
import com.biz.fm.exception.custom.LogoutByBadToken;
import com.biz.fm.exception.custom.LogoutByStateLogin;
import com.biz.fm.exception.custom.ReLogin;
import com.biz.fm.exception.custom.UpdateFailException;

@RestControllerAdvice
public class FmExceptionHandler {
	
	@ExceptionHandler(value = NotFoundException.class)
	public ResponseEntity<?> notFoundException(NotFoundException ex){
		return getResponseEntity(ErrorCode.NOT_FOUND, ex.getMessage());
	}
	
	@ExceptionHandler(value = EmailDuplicationException.class)
	public ResponseEntity<?> emailDuplicationException(EmailDuplicationException ex){
		return getResponseEntity(ErrorCode.EMAIL_DUPLICATION, ex.getMessage());
	}
	
	@ExceptionHandler(value = InvalidPasswordException.class)
	public ResponseEntity<?> invalidPasswordException(InvalidPasswordException ex){
		return getResponseEntity(ErrorCode.INVALID_PASSWORD, ex.getMessage());
	}
	@ExceptionHandler(value = InvalidEmailException.class)
	public ResponseEntity<?> invalidIdException(InvalidEmailException ex){
		return getResponseEntity(ErrorCode.INVALID_EMAIL, ex.getMessage());
	}
	
	@ExceptionHandler(value = HttpRequestMethodNotSupportedException.class)
	public ResponseEntity<?> httpRequestMethodNotSupportedException(HttpRequestMethodNotSupportedException ex){
		return getResponseEntity(ErrorCode.METHOD_NOT_ALLOW, ex.getMessage());
	}
	
	@ExceptionHandler(value = ParseException.class)
	public ResponseEntity<?> parseException(ParseException ex){
		return getResponseEntity(ErrorCode.DATE_PARSE, ex.getMessage());
	}
	
	@ExceptionHandler(value = InsertFailException.class)
	public ResponseEntity<?> insertFailException(InsertFailException ex){
		return getResponseEntity(ErrorCode.INSERT_FAIL, ex.getMessage());
	}
	
	@ExceptionHandler(value = UpdateFailException.class)
	public ResponseEntity<?> updateFailException(UpdateFailException ex){
		return getResponseEntity(ErrorCode.UPDATE_FAIL, ex.getMessage());
	}
	
	@ExceptionHandler(value = DeleteFailException.class)
	public ResponseEntity<?> deleteFailException(DeleteFailException ex){
		return getResponseEntity(ErrorCode.DELETE_FAIL, ex.getMessage());
	}
	
	@ExceptionHandler(value = ReLogin.class)
	public ResponseEntity<?> reLogin(ReLogin ex){
		return getResponseEntity(ErrorCode.RELOGIN, ex.getMessage());
	}
	
	@ExceptionHandler(value = LogoutByBadToken.class)
	public ResponseEntity<?> logoutByBadToken(LogoutByBadToken ex){
		return getResponseEntity(ErrorCode.LOGOUT_BY_BAD_TOKEN, ex.getMessage());
	}
	
	@ExceptionHandler(value = LogoutByStateLogin.class)
	public ResponseEntity<?> logoutByStateLogin(LogoutByStateLogin ex){
		return getResponseEntity(ErrorCode.LOGOUT_BY_STATE_LOGIN, ex.getMessage());
	}
	
	@ExceptionHandler(MethodArgumentNotValidException.class)
	protected ResponseEntity<?> methodArgumentNotValidException(MethodArgumentNotValidException ex) {
		Map<String, String> messageMap = new HashMap<>();
		
		for(FieldError error : ex.getBindingResult().getFieldErrors()) {
			messageMap.put(error.getField(), error.getDefaultMessage());
		}
		
		return getResponseEntity(ErrorCode.ARGUMENT_INVALID, messageMap);
	}
	
	@ExceptionHandler(ConstraintViolationException.class)
	protected ResponseEntity<?> constraintViolationException(ConstraintViolationException ex) {
		return getResponseEntity(ErrorCode.ARGUMENT_INVALID, ex.getMessage());
	}    
	
	@ExceptionHandler(MissingServletRequestParameterException.class)
	protected ResponseEntity<?> missingServletRequestParameterException(MissingServletRequestParameterException ex) {
		return getResponseEntity(ErrorCode.ARGUMENT_INVALID, ex.getMessage());
	}
	
	@ExceptionHandler(HttpMessageNotReadableException.class)
	protected ResponseEntity<?> httpMessageNotReadableException(HttpMessageNotReadableException ex) {
		return getResponseEntity(ErrorCode.ARGUMENT_INVALID, ex.getMostSpecificCause().getMessage());
	}
	
	@ExceptionHandler(UnsatisfiedServletRequestParameterException.class)
	protected ResponseEntity<?> unsatisfiedServletRequestParameterException(UnsatisfiedServletRequestParameterException ex) {
		return getResponseEntity(ErrorCode.ARGUMENT_INVALID, ex.getMessage());
	}
	
	@ExceptionHandler(SQLException.class)
	protected ResponseEntity<?> SQLException(SQLException ex) {
		return getResponseEntity(ErrorCode.MYSQL_QUERY_FAIL, ex.getMessage());
	}
	
	@ExceptionHandler(FileUploadFailException.class)
	protected ResponseEntity<?> fleUploadFailException(FileUploadFailException ex) {
		return getResponseEntity(ErrorCode.FILE_UPLOAD_FAIL, ex.getMessage());
	}
	
	@ExceptionHandler(IssudToken.class)
	protected ResponseEntity<?> reissudToken(IssudToken ex) {
		return getResponseEntity(ErrorCode.ISSUED_TOKEN, ex.getMessage());
	}
	
	@ExceptionHandler(ApplicationNameDuplicationException.class)
	protected ResponseEntity<?> applicationNameDuplicationException(ApplicationNameDuplicationException ex) {
		return getResponseEntity(ErrorCode.APPLICATRION_NAME_DUPLICATION, ex.getMessage());
	}
	
	@ExceptionHandler(AppByBadToken.class)
	protected ResponseEntity<?> appByBadToken(AppByBadToken ex) {
		return getResponseEntity(ErrorCode.APP_BY_BAD_TOKEN, ex.getMessage());
	}
	
	@ExceptionHandler(BadToken.class)
	protected ResponseEntity<?> badToken(BadToken ex) {
		return getResponseEntity(ErrorCode.BAD_TOKEN, ex.getMessage());
	}
	
	private ResponseEntity<?> getResponseEntity(ErrorCode errorCode, Object detailMessage){
		ExceptionResponse exceptionResponse = new ExceptionResponse(errorCode, detailMessage);
		return ResponseEntity.status(exceptionResponse.getStatus()).body(exceptionResponse);
	}
}
