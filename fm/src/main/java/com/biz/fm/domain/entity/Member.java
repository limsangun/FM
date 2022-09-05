package com.biz.fm.domain.entity;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.biz.fm.domain.dto.MemberDto.MemberResponse;
import com.biz.fm.domain.dto.SignDto.SignIn;
import com.biz.fm.domain.dto.SignDto.SignOut;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Member implements UserDetails{
	
	private String id;
	private String name;
	private String email;
	private String password;
	private String phoneNumber;
	private Date birth;
	private String role;	//권한 추가
	private Address address;
	private Timestamp createDate;
	private Timestamp deleteDate;
	
	public MemberResponse toMemberRead() {
		return MemberResponse.builder()
				.id(id)
				.name(name)
				.email(email)
				.phoneNumber(phoneNumber)
				.address(address)
				.createDate(createDate)
				.build();
	}
	
	public SignIn toMemberSignIn() {
		return SignIn.builder()
				.email(email)
				.password(password)
				.build();
	}
	
	
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		List<GrantedAuthority> authorities  = new ArrayList<>();
		
		for(String role : role.split(",")){
            authorities.add(new SimpleGrantedAuthority(role));
        }
        return authorities;
	}

	@Override
	public String getUsername() {
		return this.email;
	}

	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	public boolean isEnabled() {
		return true;
	}
}