package com.biz.fm.exception.custom;

public class BadToken extends RuntimeException{
	public BadToken(){
		super();
	}
	
	public BadToken(String message) {
        super(message);
    }

}
