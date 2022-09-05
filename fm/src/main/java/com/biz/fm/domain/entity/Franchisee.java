package com.biz.fm.domain.entity;

import java.sql.Timestamp;

import com.biz.fm.domain.dto.FranchiseeDto.FranchiseeResponse;
import com.biz.fm.domain.dto.FranchiseeDto.FranchiseeUpdate;
import com.biz.fm.domain.dto.FranchiseeDto.Hours;
import com.biz.fm.utils.ApplicationContextUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Franchisee {
	private String businessNumber;
	private String name;
	private String firstImg;
	private Address address;
	private Double x;
	private Double y;
	private String tel;
	private Member owner;
	private String intro;
	private String hours;
	private Timestamp createDate;
	
	public Franchisee patch(FranchiseeUpdate newFranchisee) throws JsonProcessingException {
		
		ObjectMapper mapper = ApplicationContextUtils.getApplicationContext().getBean(ObjectMapper.class);
		
		if(newFranchisee.getName() != null) this.setName(newFranchisee.getName());
		if(newFranchisee.getFirstImg() != null) this.setFirstImg(newFranchisee.getFirstImg());
		if(newFranchisee.getTel() != null) this.setTel(newFranchisee.getTel());
		if(newFranchisee.getIntro() != null) this.setIntro(newFranchisee.getIntro());
		if(newFranchisee.getHours() != null) this.setHours(mapper.writeValueAsString(newFranchisee.getHours()));
		
		return this;
	}
	
	public FranchiseeResponse toFranchiseeResponse(){
		return FranchiseeResponse.builder()
				.businessNumber(businessNumber)
				.name(name)
				.firstImg(firstImg)
				.address(address)
				.x(x)
				.y(y)
				.tel(tel)
				.ownerName(owner.getName())
				.intro(intro)
				.createDate(createDate)
				.build();
	}
}
