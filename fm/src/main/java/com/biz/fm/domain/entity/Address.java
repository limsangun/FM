package com.biz.fm.domain.entity;

import javax.validation.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class Address {
	@JsonIgnore
	private String id;
	
	@NotBlank
	@ApiModelProperty(example = "우편번호")
	private String postalCode;
	
	@NotBlank
	@ApiModelProperty(example = "도로명")
	private String road;
	
	@NotBlank
	@ApiModelProperty(example = "지번 주소")
	private String jibun;
	
	@ApiModelProperty(example = "상세 주소")
	private String detail;
	
	public void patch(Address address) {
		if(address.getPostalCode() != null) this.setPostalCode(address.getPostalCode());
		if(address.getRoad() != null) this.setRoad(address.getRoad());
		if(address.getJibun() != null) this.setJibun(address.getJibun());
		if(address.getDetail() != null) this.setDetail(address.getDetail());
	}
}
