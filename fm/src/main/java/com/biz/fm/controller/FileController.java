package com.biz.fm.controller;

import java.io.IOException;
import java.util.List;

import org.apache.ibatis.javassist.NotFoundException;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.biz.fm.domain.dto.FileDataDto.UploadResponse;
import com.biz.fm.exception.custom.FileUploadFailException;
import com.biz.fm.service.FileService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.AllArgsConstructor;

@Api(tags = {"6. File"})
@AllArgsConstructor
@RequestMapping("/api/v1/file")
@RestController
@CrossOrigin
public class FileController {
	
	private final FileService fileService;
	
    @GetMapping("/{fileName}")
    @ApiOperation(value = "파일 다운로드", notes = "파일을 다운로드 한다.")
    public ResponseEntity<Resource> download(@ApiParam(value = "파일 이름", required = true) @PathVariable String fileName) throws NotFoundException {
        return fileService.loadFile(fileName);
    }

    @GetMapping("/thumbnail/{fileName}")
    @ApiOperation(value = "썸네일 다운로드", notes = "썸네일을 다운로드 한다.")
    public ResponseEntity<Resource> downloadThumbnail(@ApiParam(value = "파일 이름", required = true) @PathVariable String fileName) throws NotFoundException {
        return fileService.loadThumbnail(fileName);
    }

    @PostMapping
    @ApiOperation(value = "파일 업로드", notes = "파일을 업로드한다.")
    public ResponseEntity<List<UploadResponse>> upload(@ApiParam(value = "파일", required = true) @RequestPart("files") MultipartFile[] files) throws FileUploadFailException {
    	
    	for(MultipartFile file : files) {
    		if(file.getSize() <= 0) throw new FileUploadFailException("파일 크기가 0 입니다."); 
    	}
    	
        return ResponseEntity.ok().body(fileService.saveFiles(files));
    }
    
    @DeleteMapping("/{fileName}")
    @ApiOperation(value = "파일 삭제", notes = "파일을 삭제 한다.")
    public ResponseEntity<Object> delete(@ApiParam(value = "파일 이름", required = true) @PathVariable String fileName) throws IOException{
    	fileService.deleteFile(fileName);
    	return ResponseEntity.ok().build();
    }
}
