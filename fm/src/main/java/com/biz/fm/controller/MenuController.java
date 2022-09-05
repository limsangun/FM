package com.biz.fm.controller;

import org.apache.ibatis.javassist.NotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.biz.fm.domain.dto.MenuDto.MenuCreate;
import com.biz.fm.domain.dto.MenuDto.MenuResponse;
import com.biz.fm.domain.dto.MenuDto.MenuUpdate;
import com.biz.fm.domain.entity.Menu;
import com.biz.fm.service.MenuService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;

@Api(tags = {"5. Menu"})
@RestController
@RequestMapping("/api/v1/menu")
@RequiredArgsConstructor
@CrossOrigin
public class MenuController {

	private final MenuService menuService;
	
	@GetMapping("/{menuId}")
	@ApiOperation(value = "메뉴 조회", notes = "메뉴를 조회한다.")
	public ResponseEntity<Menu> findMenuById(@ApiParam(value = "메뉴 id", required = true) @PathVariable String menuId) throws NotFoundException{
		return ResponseEntity.ok(menuService.findMenuById(menuId));
	}
	
	@PutMapping("/{menuId}")
	@ApiOperation(value = "메뉴 수정", notes = "메뉴를 수정한다.")
	public ResponseEntity<Menu> update(@ApiParam(value = "메뉴 id", required = true) @PathVariable String menuId,
									 @ApiParam(value = "메뉴 수정 정보", required = true) @RequestBody MenuUpdate menu){
		return ResponseEntity.ok(menuService.updateMenu(menuId, menu));
	}
	
	@DeleteMapping("/{menuId}")
	@ApiOperation(value = "메뉴 삭제", notes = "메뉴를 삭제한다.")
	public ResponseEntity<Menu> delete(@ApiParam(value = "메뉴 id", required = true) @PathVariable String menuId){
		return ResponseEntity.ok(menuService.deleteMenu(menuId));
	}
}
