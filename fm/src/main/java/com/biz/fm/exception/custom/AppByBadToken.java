package com.biz.fm.exception.custom;

public class AppByBadToken extends RuntimeException{
	public AppByBadToken(){
		super();
	}
	
	public AppByBadToken(String message) {
        super(message);
    }

}
