package com.biz.fm.exception.custom;

public class DeleteFailException extends RuntimeException {
	public DeleteFailException() {
        super();
    }
	
	public DeleteFailException(String message) {
		super(message);
	}
}
