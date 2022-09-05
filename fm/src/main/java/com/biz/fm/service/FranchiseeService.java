package com.biz.fm.service;

import java.io.IOException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.apache.ibatis.javassist.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.biz.fm.domain.dto.FileDataDto.FileDataResponse;
import com.biz.fm.domain.dto.FranchiseeDto.FranchiseeCreate;
import com.biz.fm.domain.dto.FranchiseeDto.FranchiseeResponse;
import com.biz.fm.domain.dto.FranchiseeDto.FranchiseeUpdate;
import com.biz.fm.domain.dto.FranchiseeDto.Hours;
import com.biz.fm.domain.dto.FranchiseeDto.SearchFranchiseeList;
import com.biz.fm.domain.dto.MenuDto.MenuCreate;
import com.biz.fm.domain.dto.MenuDto.MenuResponse;
import com.biz.fm.domain.entity.Address;
import com.biz.fm.domain.entity.FileData;
import com.biz.fm.domain.entity.Franchisee;
import com.biz.fm.domain.entity.Menu;
import com.biz.fm.exception.custom.DeleteFailException;
import com.biz.fm.exception.custom.InsertFailException;
import com.biz.fm.exception.custom.UpdateFailException;
import com.biz.fm.repository.AddressRepository;
import com.biz.fm.repository.FileDataRepository;
import com.biz.fm.repository.FranchiseeRepository;
import com.biz.fm.repository.FranchiseeimageRepository;
import com.biz.fm.repository.MenuImageRepository;
import com.biz.fm.repository.MenuRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FranchiseeService {
	
	private final FileService fileService;
	private final ObjectMapper objectMapper;
	private final MenuRepository menuRepository;
	private final AddressRepository addressRepository;
	private final FranchiseeRepository franchiseeRepository;
	private final MenuImageRepository menuImageRepository;
	private final FileDataRepository fileDataRepository;
	private final FranchiseeimageRepository franchiseeimageRepository;
	
	public SearchFranchiseeList searchFran(String name,String businessNum, String tel, Integer page,Integer rowNums) throws NotFoundException{
		int offset = (page-1)*5;
		int count = franchiseeRepository.searchListCount(name, businessNum, tel);
		String regex = "[ !@#$%^&*(),.?\":{}|<>]"; //특수문자
		
		if (!tel.matches("[0-9]+") && !tel.isEmpty()) throw new NotFoundException("일치하는 가맹점이 없습니다.");
		else if (!businessNum.matches("[0-9]+") && !businessNum.isEmpty()) throw new NotFoundException("일치하는 가맹점이 없습니다.");
		else if (!businessNum.matches("[0-9]+") && !businessNum.isEmpty()) throw new NotFoundException("일치하는 가맹점이 없습니다.");
		else if (name.matches(regex)) throw new NotFoundException("일치하는 가맹점이 없습니다.");
		else if (tel.isEmpty() && name.isEmpty() && businessNum.isEmpty()) throw new NotFoundException("일치하는 가맹점이 없습니다.");
		else {
			List<Franchisee> franchisees = franchiseeRepository.searchList(name,businessNum,tel,offset,rowNums);
			if(franchisees.size()==0) throw new NotFoundException("일치하는 가맹점이 없습니다.");
			
			List<FranchiseeResponse> franchiseeResponses = new ArrayList<>();		
			
			for(Franchisee franchisee : franchisees) {
				franchiseeResponses.add(franchisee.toFranchiseeResponse());
			}
			SearchFranchiseeList searchfranchiseelist = new SearchFranchiseeList();
			searchfranchiseelist.setFranchisees(franchiseeResponses);
			searchfranchiseelist.setSearchCount(count);
			
			return searchfranchiseelist;
		}
		
	}
	
	public SearchFranchiseeList mapSearch(String word,int page) throws NotFoundException{
		int offset = (page-1)*10;
		int count = franchiseeRepository.mapSearchCount(word);
		List<Franchisee> franchisees = franchiseeRepository.mapSearch(word,offset); 
		
		if(franchisees.size()==0 || word.matches("[ !@#$%^&*(),.?\":{}|<>]")) {
			throw new NotFoundException("일치하는 정보가 없습니다.");
		}
		List<FranchiseeResponse> franchiseeResponses = new ArrayList<>();
		for(Franchisee franchisee : franchisees) {
			franchiseeResponses.add(franchisee.toFranchiseeResponse());
		}
		SearchFranchiseeList searchFranchiseeList = new SearchFranchiseeList();
		searchFranchiseeList.setFranchisees(franchiseeResponses);
		searchFranchiseeList.setSearchCount(count);
		
		return searchFranchiseeList;
	}
	
	public List<FranchiseeResponse> findAllByDistance(Double longitude, Double latitude, Integer radius, Integer rowNumMax) throws NotFoundException{
		
		List<Franchisee> franchisees = franchiseeRepository.findAllByDistance(longitude, latitude, radius, rowNumMax);
		
		if(franchisees.size() == 0) throw new NotFoundException(null);
		
		List<FranchiseeResponse> franchiseeResponses = new ArrayList<>();
		for(Franchisee franchisee : franchisees) {
			franchiseeResponses.add(franchisee.toFranchiseeResponse());
		}
		return franchiseeResponses;
	}
	
	public FranchiseeResponse findByBusinessNumber(String businessNumber) throws NotFoundException{
		Franchisee franchisee = franchiseeRepository.findByBusinessNumber(businessNumber);
		
		if(franchisee == null) throw new NotFoundException(null);
		
		return franchisee.toFranchiseeResponse();
	}
	
	public List<MenuResponse> findMenuByBusinessNumber(String businessNumber) throws NotFoundException{
		List<MenuResponse> menus = menuRepository.findBybusinessNumber(businessNumber);
		if(menus.size() == 0) throw new NotFoundException(null);
		
		for(MenuResponse menuResponse : menus) {
			FileData fileData = (FileData) menuResponse.getImage();
			menuResponse.setImage(fileData.toFileDataResponse());
		}

		return menus;
	}
	
	public List<FileDataResponse> findImageAllByBusinessNumber(String businessNumber) throws NotFoundException {
		List<FileData> fimages = franchiseeimageRepository.findAllByBusinessNumber(businessNumber);
		if(fimages.size() == 0) throw new NotFoundException(null);
		
		List<FileDataResponse> fileDataResponses = new ArrayList<>();
		for(FileData data : fimages) {
			fileDataResponses.add(data.toFileDataResponse());
		}
		
		return fileDataResponses;
	}
	
	public Hours findHoursByBusinessNumber(String businessNumber) throws JsonMappingException, JsonProcessingException, NotFoundException {
		String hours =  franchiseeRepository.findHoursByBusinessNumber(businessNumber);
		if(hours == null) throw new NotFoundException(null);
		
		return objectMapper.readValue(hours, Hours.class);
	}
	
	@Transactional(rollbackFor = {Exception.class})
	public FranchiseeResponse insertFranchisee(FranchiseeCreate franchiseeCreate) throws JsonMappingException, JsonProcessingException {
		
		//가맹점 주소 등록.
		Address address = franchiseeCreate.getAddress();
		address.setId(UUID.randomUUID().toString().replace("-", ""));
		addressRepository.insert(address);
		
		// 대표이미지 default 이미지 검증.
		if(franchiseeCreate.getFirstImg() == null) franchiseeCreate.setFirstImg("/api/v1/file/fm_62c01fca8f89468ab5344caea17967a3.png");
		
		// hours JSON 타입으로 넣기 위해 Serialize.
		String hours = objectMapper.writeValueAsString(franchiseeCreate.getHours().setDefaultTime());
		
		//가맹점 정보 입력.
		int result = franchiseeRepository.insert(franchiseeCreate, hours);
		if(result > 0) {

			//가맹점 대표 이미지 정보 등록
			//if(franchiseeCreate.getFirstImgId() != null) franchiseeimageRepository.insert(franchiseeCreate.getFirstImgId(), franchiseeCreate.getBusinessNumber());
			//else franchiseeimageRepository.insert("a70427302ce343c2bd29054e7dd82cc0", franchiseeCreate.getBusinessNumber());
			return franchiseeRepository.findByBusinessNumber(franchiseeCreate.getBusinessNumber()).toFranchiseeResponse();
		}
		else throw new InsertFailException(); 
	}
	
	@Transactional(rollbackFor = Exception.class)
	public boolean insertFranchiseeImage(String businessNumber, List<String> imageIds) {
		
		//가맹전 이미지 갯수 검증. (최대 10장)
		if(franchiseeimageRepository.franchisesImageCount(businessNumber) >= 10) throw new InsertFailException("가맹점 이미지는 최대 10장 등록 가능합니다.");
		
		//가맹점 이미지 데이터 등록.
		for(String imageId : imageIds) {
			int result = franchiseeimageRepository.insert(imageId, businessNumber);
			if(result <= 0) throw new InsertFailException();
		}
		
		return true;
	}
	
	@Transactional(rollbackFor = {Exception.class})
	public Menu insertMenu(String businessNumber, MenuCreate menuCreate) {
		
		Menu menu = Menu.builder()
				.id(UUID.randomUUID().toString().replace("-", ""))
				.name(menuCreate.getName())
				.description(menuCreate.getDescription())
				.businessNumber(businessNumber)
				.price(menuCreate.getPrice())
				.build();
		
		int result = menuRepository.insert(menu);
		if(result > 0) { // 메뉴 정보 입력 완료.
			//메뉴 이미지 정보 등록.
			String imageId = menuCreate.getImageId();
			if(imageId == null) menuImageRepository.insert("8572ca9e1d1511ed861d0242ac120002", menu.getId());
			else {
				if(imageId.isEmpty()) throw new InsertFailException("imageId는 빈값일 수 없습니다.");
				if(!fileDataRepository.checkFileIdExists(imageId)) throw new InsertFailException("존재하지 않는 imageId 입니다.");
				menuImageRepository.insert(imageId, menu.getId());
			}
			
			return menuRepository.findById(menu.getId());
		}else throw new InsertFailException();
	}
	
	public FranchiseeResponse update(String businessNumber, FranchiseeUpdate franchisee) throws JsonMappingException, JsonProcessingException {
		
		Franchisee oldFranchisee = franchiseeRepository.findByBusinessNumber(businessNumber);
		if(oldFranchisee == null) throw new UpdateFailException("가맹점이 존재하지 않습니다.");
		
		Franchisee newFranchisee = oldFranchisee.patch(franchisee);
		
		int result = franchiseeRepository.update(newFranchisee);
		if(result > 0) {
			return franchiseeRepository.findByBusinessNumber(businessNumber).toFranchiseeResponse();
		}
		else throw new UpdateFailException();
		
	}
	
	public FranchiseeResponse delete(String businessNumber) {
		
		Franchisee franchisee = franchiseeRepository.findByBusinessNumber(businessNumber);
		if(franchisee == null) throw new DeleteFailException();
		
		int result = franchiseeRepository.delete(businessNumber);
		if(result > 0) {
			return franchisee.toFranchiseeResponse();
		}
		else throw new DeleteFailException();
	}
	
	@Transactional(rollbackFor = Exception.class)
	public void deleteFranchiseeImage(String businessNumber, String imageId) throws IOException {
		//1. franchiseeId, fileDataId 유무 확인.
		if(!franchiseeimageRepository.checkFileIdExists(imageId, businessNumber)) throw new DeleteFailException(imageId + "(imageId) 는 " + businessNumber + "(businessNumber) 가 가지고 있는 이미지가 아닙니다."); 
		
		//2. file_data에 해당하는 파일 삭제.
//		FileData fileData = fileDataRepository.findById(imageId);
//		fileService.deleteFile(fileData.getName());
		
		//2. file_data 삭제.
		int result = fileDataRepository.delete(imageId);
		if(result <= 0) throw new DeleteFailException();
	}

	public Map<String, Boolean> checkBusinessNumber(String businessNumber) {
		Map<String, Boolean> map = new HashMap<>();
		map.put("result", !franchiseeRepository.checkBusinessNumberExists(businessNumber));
		return map;
	}

	public FranchiseeResponse findByName(String franchiseeName) {
		List<Franchisee> franchisees = franchiseeRepository.findByName(franchiseeName);
		return franchisees.get(0).toFranchiseeResponse();
	}
	
	
}
