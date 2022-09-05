package com.biz.fm.repository;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.One;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.ResultMap;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.biz.fm.domain.dto.FranchiseeDto.FranchiseeCreate;
import com.biz.fm.domain.entity.Franchisee;

@Mapper
public interface FranchiseeRepository{

	@Select("SELECT *, member.name as member_name FROM franchisee "
			+ "JOIN address ON franchisee.address_id = address.id "
			+ "JOIN member ON franchisee.owner_id = member.id "
			+ "WHERE franchisee.name LIKE CONCAT('%',#{name},'%') "
			+ "AND franchisee.business_number LIKE CONCAT('%',#{businessNum},'%') "
			+ "AND franchisee.tel LIKE CONCAT('%',#{tel},'%') "
			+ "LIMIT #{offset}, #{rowsNum} "
			)
	@ResultMap("FranchiseeEntityMap")
	public List<Franchisee> searchList(String name,String businessNum, String tel, int offset, int rowsNum);
	
	@Select("SELECT COUNT(*) FROM franchisee "
			+ "JOIN address ON franchisee.address_id = address.id "
			+ "JOIN member ON franchisee.owner_id = member.id "
			+ "WHERE franchisee.name LIKE CONCAT('%',#{name},'%') "
			+ "AND franchisee.business_number LIKE CONCAT('%',#{businessNum},'%') "
			+ "AND franchisee.tel LIKE CONCAT('%',#{tel},'%') "
			)
	public int searchListCount(String name,String businessNum, String tel);
	
	@Select("SELECT *, member.name as member_name FROM franchisee "
			+ "JOIN address ON franchisee.address_id = address.id "
			+ "JOIN member ON franchisee.owner_id = member.id "
			+ "WHERE franchisee.name LIKE CONCAT('%',#{keyword},'%') "
			+ "OR franchisee.tel LIKE CONCAT('%',#{keyword},'%') "
			+ "OR address.road LIKE CONCAT('%',#{keyword},'%') "
			+ "OR address.jibun LIKE CONCAT('%',#{keyword},'%') "
			+ "ORDER BY "
			+ "CASE WHEN franchisee.name = #{keyword} THEN 1 "
			+ "WHEN franchisee.name LIKE CONCAT('',#{keyword},'%') THEN 2 "
			+ "ELSE 3 END "
			+ "LIMIT #{offset}, 10 "
			)
	@ResultMap("FranchiseeEntityMap")
	public List<Franchisee> mapSearch(String keyword,int offset);
	
	@Select("SELECT COUNT(*) FROM franchisee "
			+ "JOIN address ON franchisee.address_id = address.id "
			+ "JOIN member ON franchisee.owner_id = member.id "
			+ "WHERE franchisee.name LIKE CONCAT('%',#{keyword},'%') "
			+ "OR franchisee.tel LIKE CONCAT('%',#{keyword},'%') "
			+ "OR address.road LIKE CONCAT('%',#{keyword},'%') "
			+ "OR address.jibun LIKE CONCAT('%',#{keyword},'%') "
			)
	public int mapSearchCount(String keyword);
	
	@Select("SELECT *, member.name as member_name FROM franchisee "
			+ "JOIN address ON franchisee.address_id = address.id "
			+ "JOIN member ON franchisee.owner_id = member.id "
			+ "WHERE ST_DISTANCE_SPHERE(POINT(#{longitude}, #{latitude}), POINT(x, y)) <= #{radius} "
			+ "ORDER BY RAND() LIMIT #{rowNumMax}")
	@Results(id="FranchiseeEntityMap", value = {
			@Result(property = "businessNumber", column = "business_number"),
			@Result(property = "name", column = "name"),
			@Result(property = "firstImg", column = "first_img"),
			@Result(property = "x", column = "x"),
			@Result(property = "y", column = "y"),
			@Result(property = "tel", column = "tel"),
			@Result(property = "intro", column = "intro"),
			@Result(property = "hours", column = "hours"),
			@Result(property = "createDate", column = "create_date"),
			@Result(property = "owner", column = "owner_id", one = @One(resultMap = "com.biz.fm.repository.MemberRepository.MemberEntityMap")),
			@Result(property = "address", column = "address_id", one = @One(resultMap = "com.biz.fm.repository.AddressRepository.AddressEntityMap"))
		})
	public List<Franchisee> findAllByDistance(double longitude, double latitude, int radius, int rowNumMax);
	
	@Select("SELECT *, member.name as member_name FROM franchisee "
			+ "JOIN address ON franchisee.address_id = address.id "
			+ "JOIN member ON franchisee.owner_id = member.id "
			+ "WHERE owner_id = #{memberId} "
			+ "AND franchisee.name LIKE CONCAT('%',#{query},'%') "
			+ "ORDER BY franchisee.${order} ${option} "
			+ "LIMIT #{offset}, 5 "
			)
	@ResultMap("FranchiseeEntityMap")
	public List<Franchisee> findBySearchParam(String memberId, int offset, String order, String option, String query);
	
	@Select("SELECT *, member.name as member_name FROM franchisee "
			+ "JOIN address ON franchisee.address_id = address.id "
			+ "JOIN member ON franchisee.owner_id = member.id "
			+ "WHERE owner_id = #{memberId} "
			)
	@ResultMap("FranchiseeEntityMap")
	public List<Franchisee> findAllByMemberId(String memberId);

	@Select("SELECT COUNT(*) FROM franchisee WHERE owner_id = #{memberId} AND name LIKE CONCAT('%',#{name},'%')")
	public int findAllByMemberIdCount(String memberId, String name);
	
	
	@Select("SELECT *, member.name as member_name FROM franchisee "
			+ "JOIN address ON franchisee.address_id = address.id "
			+ "JOIN member ON franchisee.owner_id = member.id "
			+ "ORDER BY franchisee.name "
			+ "LIMIT #{offset}, #{rowsNum} ")
	@ResultMap("FranchiseeEntityMap")
	public List<Franchisee> findAllByPage(int offset, int rowsNum);
	
	@Select("SELECT *, member.name as member_name FROM franchisee "
			+ "JOIN address ON franchisee.address_id = address.id "
			+ "JOIN member ON franchisee.owner_id = member.id "
			+ "WHERE franchisee.name like CONCAT('%', #{bsnsNm}, '%') "
			+ "ORDER BY franchisee.name "
			+ "LIMIT #{offset}, #{rowsNum} ")
	@ResultMap("FranchiseeEntityMap")
	public List<Franchisee> findAllByPageWithBusinessName(int offset, int rowsNum, String bsnsNm);
	
	@Select("SELECT *, member.name as member_name FROM franchisee "
			+ "JOIN address ON franchisee.address_id = address.id "
			+ "JOIN member ON franchisee.owner_id = member.id "
			+ "WHERE business_number = #{businessNumber} ")
	@ResultMap("FranchiseeEntityMap")
	public Franchisee findByBusinessNumber(String businessNumber);
	
	
	@Select("SELECT *, member.name as member_name FROM franchisee "
			+ "JOIN address ON franchisee.address_id = address.id "
			+ "JOIN member ON franchisee.owner_id = member.id "
			+ "WHERE franchisee.name = #{franchiseeName} ")
	@ResultMap("FranchiseeEntityMap")
	public List<Franchisee> findByName(String franchiseeName);
	
	@Select("SELECT hours FROM franchisee WHERE business_number = #{businessNumber}")
	public String findHoursByBusinessNumber(String businessNumber);
	
	
	@Select("SELECT EXISTS(SELECT 1 FROM franchisee WHERE business_number = #{businessNumber})")
	public boolean checkBusinessNumberExists(String businessNumber);
	
	@Insert("INSERT INTO franchisee VALUES (#{fc.businessNumber}, #{fc.name}, #{fc.firstImg}, "
			+ "#{fc.address.id}, #{fc.x}, #{fc.y}, #{fc.tel}, #{fc.ownerId}, #{fc.intro}, #{hours}, "
			+ "now(), null)")
	public int insert(@Param("fc") FranchiseeCreate franchiseeCreate, @Param("hours") String hours);
	
	@Update("UPDATE franchisee SET name = #{name}, first_img = #{firstImg}, "
			+ "x = #{x}, y = #{y}, tel = #{tel}, intro = #{intro}, "
			+ "hours = #{hours} WHERE business_number = #{businessNumber}")
	public int update(Franchisee franchisee);
	
	@Delete("Delete FROM franchisee WHERE business_number = #{businessNumber}")
	public int delete(String businessNumber);
}
