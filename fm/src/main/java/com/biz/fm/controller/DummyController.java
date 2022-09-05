package com.biz.fm.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.FileStore;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.biz.fm.domain.entity.FileData;
import com.biz.fm.repository.FileDataRepository;
import com.biz.fm.service.FileService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/dummy")
public class DummyController {
	
	private final FileDataRepository dataRepository;
	private final Path path;
	
	@GetMapping("/file-cleanup")
	public ResponseEntity<Object> getDummy() throws IOException{
		List<FileData> fileDatas = dataRepository.findAll();
		List<String> dbFileNames = new ArrayList<String>();
		for(FileData fileData : fileDatas) {
			dbFileNames.add(fileData.getName());
		}
		
		File fileStore = new File(path.toString());
		File[] listOfFiles = fileStore.listFiles();
		for(File file : listOfFiles) {
			String fileName = file.getName();
			
			boolean exist = false;
			for(String name : dbFileNames) {
				if(name.equals(fileName)) {
					exist = true;
					break;
				}
			}
			if(!exist) {
				file.delete();
			}
		}
		return ResponseEntity.ok().build();
	}
}
