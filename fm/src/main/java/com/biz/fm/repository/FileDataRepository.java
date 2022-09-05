package com.biz.fm.repository;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.ResultMap;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;

import com.biz.fm.domain.entity.FileData;

@Mapper
public interface FileDataRepository {
	
	@Select("SELECT *, id as file_id, name as file_name, create_date as f_create_date from file_data WHERE id = #{fileId} AND delete_date is null")
	@Results(id = "fileData", value = {
			@Result(property = "id", column = "file_id"),
			@Result(property = "path", column = "path"),
			@Result(property = "size", column = "size"),
			@Result(property = "name", column = "file_name"),
			@Result(property = "type", column = "type"),
			@Result(property = "createDate", column = "f_create_date")			
	})
	public FileData findById(String fileId);
	
	@Select("SELECT * FROM file_data")
	public List<FileData> findAll();
	
	@Select("SELECT *, id as file_id, name as file_name, create_date as f_create_date from file_data WHERE name = #{fileName} AND delete_date is null")
	@ResultMap("fileData")
	public FileData findByName(String fileName);
	
	@Select("SELECT EXISTS(SELECT 1 FROM file_data WHERE id = #{fileDataId})")
	public boolean checkFileIdExists(String fileDataId);
	
	@Insert("INSERT INTO file_data VALUES (#{id}, #{path}, #{size}, #{name}, #{type}, now(), null)")
	public int insert(FileData fileData);
	
	@Delete("DELETE FROM file_data where id = #{fileDataId}")
	public int delete(String fileDataId);
}
