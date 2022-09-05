package com.biz.fm.exception.custom;

public class ForbiddenException extends RuntimeException{
	
	public ForbiddenException(){
		super();
	}
	
	public ForbiddenException(String message){
		super(message);
	}

}
