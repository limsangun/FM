package com.biz.fm.domain.dto;

import java.sql.Date;
import java.sql.Timestamp;

import javax.validation.constraints.Size;

import com.biz.fm.domain.entity.Address;
import com.biz.fm.domain.entity.Member;
import com.biz.fm.utils.Role;
import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class MemberDto {
	
	@Getter
	@Setter
	public static class safeinfo{
		private String id;
		private String name;
		private String email;
		private String phoneNumber;
	}
	
	@Getter
	@Setter
	@AllArgsConstructor
	@NoArgsConstructor
	@Builder
	public static class MemberUp {

		private String id;
		private String name;
		private String email;
		private String password;
		private String phoneNumber;
		@JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
		private Date birth;
		private Role role;
		private String addressId;
	}
	
	@Getter
	@Setter
	@Builder
	public static class MemberResponse{
		private String id;
		private String name;
		private String email;
		private String phoneNumber;
		private Address address;
		@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
		private Timestamp createDate;
	}
	
	@Getter
	@Setter
	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	public static class MemberUpdate{
		@Size(min = 11, max = 11, message = "전화번호는 11 자리여야 합니다.")
		private String phoneNumber;
		private Address address;
		
		public MemberUpdate patch(Member Member) {
			
			if(this.getPhoneNumber() == null) this.setPhoneNumber(Member.getPhoneNumber());
			
			return this;
		}
	}
}
