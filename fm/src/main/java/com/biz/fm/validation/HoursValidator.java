package com.biz.fm.validation;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import com.biz.fm.domain.dto.FranchiseeDto.Hours;
import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class HoursValidator implements ConstraintValidator<HoursValid, Hours>{

//	private ObjectMapper objectMapper;
//	
//	@Override
//	public void initialize(JsonString constraintAnnotation) {
//		ConstraintValidator.super.initialize(constraintAnnotation);
//		objectMapper = new ObjectMapper();
//	}
	
	@Override
	public boolean isValid(Hours value, ConstraintValidatorContext context) {
		if(value.getMonday() == null) return false;
		if(value.getTuesday() == null) return false;
		if(value.getWednesday() == null) return false;
		if(value.getThursday() == null) return false;
		if(value.getFriday() == null) return false;
		if(value.getSaturday() == null) return false;
		if(value.getSunday() == null) return false;
	    return true;
	}

}
