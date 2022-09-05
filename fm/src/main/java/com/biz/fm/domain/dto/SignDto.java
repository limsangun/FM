package com.biz.fm.domain.dto;

import java.sql.Date;

import com.biz.fm.domain.entity.Address;
import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class SignDto {
	
	@Getter
	@Setter
	@AllArgsConstructor
	@NoArgsConstructor
	@Builder
	public static class SignIn {

		private String email;
		private String password;
	}
	
	@Getter
	@Setter
	@AllArgsConstructor
	@NoArgsConstructor
	@Builder
	public static class SignOut {

		private String email;
		private String accessToken;
	}
	
	@Getter
	@Setter
	@Builder
	public static class SignInfo{

		private String id;
		private String name;
		private String accessToken;
		private String refreshToken;
		
	}
	
	@Getter
	@Setter
	public static class SignUp {
		
		private String name;
		private String email;
		private String password;
		private String phoneNumber;
		@JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
		private Date birth;
		private Address address;
		

	}

}
