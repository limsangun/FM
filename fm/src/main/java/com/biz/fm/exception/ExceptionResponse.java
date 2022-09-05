package com.biz.fm.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExceptionResponse {
	private String message;
	private Integer status;
	private String code;
	private Object detail;
	
	public ExceptionResponse(ErrorCode errorCode) {
		this.message = errorCode.getMessage();
		this.status = errorCode.getStatus().value();
		this.code = errorCode.getCode();
		this.detail = "";
	}
	
	public ExceptionResponse(ErrorCode errorCode, Object detail) {
		this.message = errorCode.getMessage();
		this.status = errorCode.getStatus().value();
		this.code = errorCode.getCode();
		this.detail = detail;
	}
}
