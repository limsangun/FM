package com.biz.fm.exception.custom;

public class UpdateFailException extends RuntimeException {
	public UpdateFailException() {
        super();
    }
	
	public UpdateFailException(String message) {
        super(message);
    }
}
