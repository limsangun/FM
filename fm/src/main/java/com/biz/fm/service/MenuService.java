package com.biz.fm.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.apache.ibatis.javassist.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.biz.fm.domain.dto.MenuDto.MenuCreate;
import com.biz.fm.domain.dto.MenuDto.MenuResponse;
import com.biz.fm.domain.dto.MenuDto.MenuUpdate;
import com.biz.fm.domain.entity.Menu;
import com.biz.fm.exception.custom.DeleteFailException;
import com.biz.fm.exception.custom.InsertFailException;
import com.biz.fm.exception.custom.UpdateFailException;
import com.biz.fm.repository.MenuImageRepository;
import com.biz.fm.repository.MenuRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MenuService {

	private final MenuRepository menuRepository;
	private final MenuImageRepository menuImageRepository;
	
//	public List<MenuResponse> getList() throws NotFoundException{
//		List<Menu> menus = menuRepository.findAll();
//		if(menus.size() == 0) throw new NotFoundException(null);
//		
//		List<MenuResponse> menusReads = new ArrayList<>();
//		for(Menu menu : menus) {
//			menusReads.add(menu.toMenuRead());
//		}
//		return menusReads;
//	}
	
	public Menu findMenuById(String memberId) throws NotFoundException {
		Menu menu = menuRepository.findById(memberId);
		if(menu == null) throw new NotFoundException(null);
		return menu;
	}
	
	@Transactional(rollbackFor = Exception.class)
	public Menu updateMenu(String menuId, MenuUpdate menuUpdate) {
		Menu oldMenu = menuRepository.findById(menuId);
		if(oldMenu == null) throw new UpdateFailException("메뉴를 찾을 수 없습니다. menuId를 확인하세요.");
		
	
		//메뉴 정보 수정.
		Menu newMenu = oldMenu.patch(menuUpdate);
		
		if(menuUpdate.getImageId() != null) {
			int result = menuImageRepository.updateMenuImage(menuUpdate.getImageId(), newMenu.getId());
			if(result <= 0) {
				throw new UpdateFailException("메뉴 이미지를 수정하지 못 했습니다.");
			}
		}
		
		int result = menuRepository.update(newMenu);
		if(result > 0) {
			return menuRepository.findById(menuId);
		}
		else throw new UpdateFailException();
	}

	public Menu deleteMenu(String id) {
		Menu menu = menuRepository.findById(id);
		if(menu == null) throw new DeleteFailException();
		
		int result = menuRepository.delete(id);
		if(result > 0) {
			return menu;
		}
		else throw new DeleteFailException();
	}

}
