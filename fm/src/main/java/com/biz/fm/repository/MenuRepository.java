package com.biz.fm.repository;

import java.util.List;

import org.apache.ibatis.annotations.*;

import com.biz.fm.domain.dto.MenuDto.MenuResponse;
import com.biz.fm.domain.entity.Menu;

@Mapper
public interface MenuRepository {
	
	@Select("SELECT * FROM menu WHERE id = #{id} and delete_date is null")
	public Menu findById(String id);
	
	@Select("SELECT menu.id as menu_id, "
			+ "menu.name as menu_name, "
			+ "menu.description as menu_description, "
			+ "menu.price as menu_price, "
			+ "menu.create_date as m_create_date, "
			+ "file_data.id as file_id, "
			+ "file_data.path as path, "
			+ "file_data.size as size, "
			+ "file_data.name as file_name, "
			+ "file_data.type as type, "
			+ "file_data.create_date as f_create_date "
			+ "FROM menu_image "
			+ "JOIN menu ON menu_image.menu_id = menu.id "
			+ "JOIN file_data ON menu_image.file_id = file_data.id "
			+ "WHERE menu.business_number = #{businessNumber} AND menu.delete_date IS NULL")
	@Results({
		@Result(property = "id", column = "menu_id"),
		@Result(property = "name", column = "menu_name"),
		@Result(property = "image", one = @One(resultMap = "com.biz.fm.repository.FileDataRepository.fileData")),
		@Result(property = "description", column = "menu_description"),
		@Result(property = "price", column = "menu_price"),
		@Result(property = "createDate", column = "m_create_date")
	})
	public List<MenuResponse> findBybusinessNumber(String businessNumber);
	
	@Insert("INSERT INTO menu VALUES (#{id}, #{name}, #{price}, #{description}, #{businessNumber}, now(), null)")
	public int insert(Menu menu);
	
	@Update("UPDATE menu SET name = #{name}, price = #{price}, description = #{description} WHERE id = #{id}")
	public int update(Menu menu);
	
	@Update("UPDATE menu SET delete_Date = now() WHERE id = #{id}")
	public int delete(String id);
}
