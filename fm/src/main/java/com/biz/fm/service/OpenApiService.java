package com.biz.fm.service;

import java.util.ArrayList;
import java.util.List;

import org.apache.ibatis.javassist.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.biz.fm.domain.dto.FileDataDto.FileDataListResonse;
import com.biz.fm.domain.dto.FileDataDto.FileDataOpenResponse;
import com.biz.fm.domain.dto.FileDataDto.FileDataResponse;
import com.biz.fm.domain.dto.FranchiseeDto.FranchiseeListResonse;
import com.biz.fm.domain.dto.FranchiseeDto.FranchiseeResponse;
import com.biz.fm.domain.dto.FranchiseeDto.Hours;
import com.biz.fm.domain.dto.MenuDto.MenuListResonse;
import com.biz.fm.domain.dto.MenuDto.MenuOpenApiResponse;
import com.biz.fm.domain.dto.MenuDto.MenuResponse;
import com.biz.fm.domain.entity.FileData;
import com.biz.fm.domain.entity.Franchisee;
import com.biz.fm.repository.FranchiseeRepository;
import com.biz.fm.repository.FranchiseeimageRepository;
import com.biz.fm.repository.MenuRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OpenApiService {
	
	private final MenuRepository menuRepository;
	private final FranchiseeService franchiseeService;
	private final FranchiseeRepository franchiseeRepository;
	private final FranchiseeimageRepository franchiseeimageRepository;
	
	public FranchiseeListResonse findAllByPage(int page, int rowsNum, String bsnsNm) throws NotFoundException {
		
		int offset = (page - 1) * rowsNum;
		List<Franchisee> franchisees = null;
		
		if(bsnsNm == null) {
			franchisees = franchiseeRepository.findAllByPage(offset, rowsNum);
		}else {
			bsnsNm = bsnsNm.trim();
			franchisees = franchiseeRepository.findAllByPageWithBusinessName(offset, rowsNum, bsnsNm);
		}
		
		if(franchisees.size() == 0) throw new NotFoundException("조건에 맞는 가맹점을 찾지 못 했습니다.");
		
		List<FranchiseeResponse> franchiseeResponses = new ArrayList<>();
		for(Franchisee franchisee : franchisees) {
			franchiseeResponses.add(franchisee.toFranchiseeResponse());
		}
		
		FranchiseeListResonse franchiseeListResonse = FranchiseeListResonse.builder()
																		 .franchisees(franchiseeResponses)
																		 .build();
		
		return franchiseeListResonse;
	}
	
	public FranchiseeResponse findByBusinessNumber(String businessNumber) throws NotFoundException{
		return franchiseeService.findByBusinessNumber(businessNumber);
	}
	
	public MenuListResonse findMenuByBusinessNumber(String businessNumber) throws NotFoundException{
		
		List<MenuResponse> menus = menuRepository.findBybusinessNumber(businessNumber);
		if(menus.size() == 0) throw new NotFoundException("조건에 맞는 메뉴를 찾지 못 했습니다.");
		
		List<MenuOpenApiResponse> menuOpenApiResponses = new ArrayList<>();
		for(MenuResponse menuResponse : menus) {
			
			FileData fileData = (FileData) menuResponse.getImage();
			menuResponse.setImage(fileData.toFileDataResponse());
			
			MenuOpenApiResponse menuOpenApiResponse = MenuOpenApiResponse.builder()
																	   .name(menuResponse.getName())
																	   .image(menuResponse.getImage())
																	   .description(menuResponse.getDescription())
																	   .price(menuResponse.getPrice())
																	   .createDate(menuResponse.getCreateDate())
																	   .build();
			menuOpenApiResponses.add(menuOpenApiResponse);
		}

		return MenuListResonse.builder()
							   .menus(menuOpenApiResponses)
							   .build();
	}
	
	public FileDataListResonse findImageAllByBusinessNumber(String businessNumber) throws NotFoundException {
		List<FileData> fimages = franchiseeimageRepository.findAllByBusinessNumber(businessNumber);
		if(fimages.size() == 0) throw new NotFoundException("조건에 맞는 이미지를 찾지 못 했습니다.");
		
		List<FileDataOpenResponse> fileDataResponses = new ArrayList<>();
		for(FileData data : fimages) {
			fileDataResponses.add(data.toFileDataOpenResponse());
		}
		
		return FileDataListResonse.builder()
								   .images(fileDataResponses)
								   .build();
	}
	
	public Hours findHoursByBusinessNumber(String businessNumber) throws JsonMappingException, JsonProcessingException, NotFoundException {
		Hours hours = null;
		try {
			hours = franchiseeService.findHoursByBusinessNumber(businessNumber);
		} catch (Exception e) {
			throw new NotFoundException("조건에 맞는 영업시간을 찾지 못 했습니다.");
		}
		
		return hours;
	}
}
