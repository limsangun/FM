package com.biz.fm.domain.dto;

import lombok.Getter;
import lombok.Setter;

public class EmailPasswordValicationDto {
	
	@Getter
	@Setter
	public static class UpdatePassword {
		private String email;
		private String newPassword;
		private String code;
	}
	
	@Getter
	@Setter
	public static class SendMail {
		private String email;
	}

}
