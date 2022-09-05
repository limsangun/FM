package com.biz.fm.repository;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.biz.fm.domain.entity.FileData;

@Mapper
public interface FranchiseeimageRepository{
	@Select("SELECT file_data.* FROM franchisee_image "
			+ "JOIN file_data "
			+ "ON franchisee_image.file_id = file_data.id "
			+ "WHERE franchisee_image.business_number = #{businessNumber};")
	public List<FileData> findAllByBusinessNumber(String businessNumber);
	
	@Select("SELECT COUNT(*) FROM franchisee_image WHERE business_number = #{businessNumber}")
	public int franchisesImageCount(String businessNumber);
	
	@Select("SELECT EXISTS(SELECT 1 FROM franchisee_image WHERE file_id = #{fileDataId} AND business_number = #{businessNumber})")
	public boolean checkFileIdExists(String fileDataId, String businessNumber);
	
	@Insert("INSERT INTO franchisee_image VALUES (#{fileId}, #{businessNumber})")
	public int insert(String fileId, String businessNumber);
}
