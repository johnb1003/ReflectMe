package com.reflectme.server.controller;

import javax.validation.Valid;

import com.reflectme.server.model.Mirror;
import com.reflectme.server.service.AccountService;
import com.reflectme.server.service.MirrorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.reflectme.server.exception.ResourceNotFoundException;
import com.reflectme.server.model.Account;
import com.reflectme.server.repository.AccountRepository;

import java.security.Principal;
import java.time.LocalDate;

@RestController
@RequestMapping(value = "/v1/mirror")
public class MirrorController {

    @Autowired
    private MirrorService mirrorService;

    /*
    @PostMapping("/create")
    public ResponseEntity createMirror(@Valid @RequestBody Mirror mirror, Principal principal) {
        mirror.setUserid(Long.parseLong(principal.getName()));
        return mirrorService.createMirror(mirror);
    }

    // Request sent from mirror
    @PostMapping("/connect/{mirrorID}")
    public ResponseEntity connectMirror(@Valid @RequestBody Account account,
                                     @PathVariable(value = "mirrorID")String mirrorID) {

        return mirrorService.connectMirror(account, Long.parseLong(mirrorID));
    }

    @GetMapping("/list/all")
    public ResponseEntity getAllMirrors(Principal principal) {

        return mirrorService.getAllMirrors(Long.parseLong(principal.getName()));
    }

    // Request sent from mirror
    @GetMapping("/list/available")
    public ResponseEntity getAvailableMirrors(@Valid @RequestBody Account account) {

        return mirrorService.getAvailableMirrors(account);
    }

    /*
    // Request sent from mirror
    @GetMapping("/data")
    public ResponseEntity getDayEvents(@Valid @RequestBody Mirror mirror, Principal principal) {

        return mirrorService.getDayEvents(Long.parseLong(principal.getName()));
    }

     */
    
}