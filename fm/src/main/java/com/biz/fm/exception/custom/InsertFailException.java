package com.biz.fm.exception.custom;

public class InsertFailException extends RuntimeException {
	public InsertFailException() {
        super();
    }
	
	public InsertFailException(String message) {
        super(message);
    }
}
