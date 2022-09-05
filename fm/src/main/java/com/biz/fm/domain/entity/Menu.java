package com.biz.fm.domain.entity;

import java.sql.Timestamp;

import com.biz.fm.domain.dto.MenuDto.MenuResponse;
import com.biz.fm.domain.dto.MenuDto.MenuUpdate;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

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
public class Menu {
	
	private String id;
	private String name;
	private String description; 
	private String businessNumber;
	private Integer price;
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
	private Timestamp createDate;
	@JsonIgnore
	private Timestamp deleteDate;
	
	public Menu patch(MenuUpdate menuUpdate) {
		
		if(menuUpdate.getName() != null) this.setName(menuUpdate.getName());
		if(menuUpdate.getPrice() != null) this.setPrice(menuUpdate.getPrice());
		if(menuUpdate.getDescription() != null) this.setDescription(menuUpdate.getDescription());
		
		return this;
	}
}
