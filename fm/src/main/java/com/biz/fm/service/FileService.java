package com.biz.fm.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.annotation.PostConstruct;

import org.apache.ibatis.javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.biz.fm.domain.dto.FileDataDto.UploadResponse;
import com.biz.fm.domain.entity.FileData;
import com.biz.fm.exception.custom.DeleteFailException;
import com.biz.fm.exception.custom.FileStorageException;
import com.biz.fm.repository.FileDataRepository;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import net.coobird.thumbnailator.Thumbnailator;

@Service
@RequiredArgsConstructor
public class FileService {
	
	//@Value("${server.servlet.context-path}")
	private String rootPath = "/api/v1";
	private final Path path;
	private final FileDataRepository fileDataRepository;

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(this.path);
        } catch (Exception ex) {
            throw new FileStorageException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public List<UploadResponse> saveFiles(MultipartFile[] files){
    	
    	// foreach 사용.
    	List<UploadResponse> responseList = new ArrayList<>();
    	for(MultipartFile file : files) {
    		responseList.add(this.save(file));
        }
    	
    	return responseList;
    	
    	// stream 사용.
//    	return Arrays.asList(files)
//                .stream()
//                .map(this::save)
//                .collect(Collectors.toList());
    }

    private UploadResponse save(MultipartFile file){
    	
    	String uuid = UUID.randomUUID().toString().replace("-", "");
    	String originalName = file.getOriginalFilename();
    	String extension = originalName.substring(originalName.lastIndexOf(".") + 1);
    	
    	String fileName = StringUtils.cleanPath("fm_" + uuid + "." + extension);

        try {
        	// 파일명에 유효하지 않는 문자 검사.
            if(fileName.contains("..")) {
                throw new FileStorageException("Sorry! Filename contains invalid path sequence " + fileName);
            }

            if (this.checkImageType(file)){
                Path thumbnailPath = this.path.resolve("thumb-" + fileName);
                FileOutputStream thumbnail = new FileOutputStream(new File(thumbnailPath.toString()));
                Thumbnailator.createThumbnail(file.getInputStream(), thumbnail, 100, 100);
            }
            
            String fileDownloadPath = rootPath + "/file/" + fileName;
            
            
            FileData fileData = FileData.builder()
					            		.id(uuid)
					            		.path(fileDownloadPath)
					            		.size(String.valueOf(file.getSize()))
					            		.name(fileName)
					            		.type(file.getContentType())
					                    .build();
            
            int result = fileDataRepository.insert(fileData);
            
            // 파일 저장 (파일 명이 같을 경우, 덮어씌기)
            Path targetLocation = this.path.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return fileDataRepository.findById(fileData.getId()).toUploadResponse();

        } catch (IOException ex) {
            throw new FileStorageException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    private boolean checkImageType(MultipartFile file){
        String contentType = file.getContentType();
        return contentType.startsWith("image");
    }
    
    public ResponseEntity<Resource> loadThumbnail(String fileName) throws NotFoundException {
    	return this.loadFile("thumb-" + fileName);
    }

    public ResponseEntity<Resource> loadFile(String fileName) throws NotFoundException {
    	
    	FileData fileData = fileDataRepository.findByName(fileName);
    	if(fileData == null) throw new NotFoundException(fileName + " 파일을 찾을 수 없습니다.");
    	
        try {
            Path filePath = this.path.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if(!resource.exists()) {
            	throw new NotFoundException(fileName + " 파일을 찾을 수 없습니다.");
            }

            String contentType = fileData.getType();
            String originFileName = fileName.substring(fileName.lastIndexOf("-") + 1);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + originFileName + "\"")
                    .body(resource);

        } catch (MalformedURLException exception) {
        	throw new NotFoundException(fileName + " 파일을 찾을 수 없습니다.");
        }
    }
    
    public void deleteFile(String fileName) throws IOException {
    	Path targetLocation = this.path.resolve(fileName);
    	if(!Files.deleteIfExists(targetLocation)) throw new DeleteFailException("파일을 삭제하지 못 하였습니다.");
    }
}
