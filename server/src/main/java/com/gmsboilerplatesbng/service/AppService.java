package com.gmsboilerplatesbng.service;

import com.gmsboilerplatesbng.service.configuration.ConfigurationService;
import com.gmsboilerplatesbng.service.security.ownedentity.OwnedEntityService;
import com.gmsboilerplatesbng.service.security.permission.PermissionService;
import com.gmsboilerplatesbng.service.security.role.RoleService;
import com.gmsboilerplatesbng.service.security.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

/**
 * AppService
 *
 * @author Asiel Leal Celdeiro <lealceldeiro@gmail.com>
 * @version 0.1
 * Dec 18, 2017
 */@Service
@Transactional
@RequiredArgsConstructor
public class AppService {

     private final ConfigurationService configurationService;
     private final PermissionService permissionService;
     private final RoleService roleService;
     private final UserService userService;
     private final OwnedEntityService oeService;

     public boolean isInitialLoadOK() {
         boolean ok = true;
         if (!configurationService.configurationExist()) { //first app start up
             ok = configurationService.createDefaultConfig();
             ok = ok && permissionService.createDefaultPermissions();
             ok = ok && roleService.createDefaultRole() != null;
             ok = ok && userService.createDefaultUser() != null;
             ok = ok && oeService.createDefaultEntity() != null;
             ok = ok && configurationService.assignDefaultUserToEntityWithRole();
         }
         return ok;
     }
}
