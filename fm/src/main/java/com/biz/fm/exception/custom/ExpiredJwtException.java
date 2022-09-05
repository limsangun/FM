package com.biz.fm.exception.custom;

public class ExpiredJwtException extends RuntimeException{
	
	public ExpiredJwtException(){
		super();
	}
	
	public ExpiredJwtException(String message){
		super(message);
	}
}
