package com.biz.fm.repository;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface MenuImageRepository {
	
	@Insert("INSERT INTO menu_image VALUES (#{fileId}, #{menuId})")
	public int insert(String fileId, String menuId);
	
	@Update("UPDATE menu_image SET file_id = #{fileId} WHERE menu_id = #{menuId}")
	public int updateMenuImage(String fileId, String menuId);
}
