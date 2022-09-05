package com.biz.fm.exception.custom;

public class LogoutByBadToken extends RuntimeException{
	public LogoutByBadToken(){
		super();
	}
	
	public LogoutByBadToken(String message) {
        super(message);
    }

}
