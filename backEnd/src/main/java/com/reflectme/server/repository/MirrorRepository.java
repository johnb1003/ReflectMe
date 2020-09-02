package com.reflectme.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.reflectme.server.model.Mirror;

@Repository
public interface MirrorRepository extends JpaRepository<Mirror, Long>, MirrorRepositoryCustom{

}