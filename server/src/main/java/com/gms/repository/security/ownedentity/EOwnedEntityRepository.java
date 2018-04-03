package com.gms.repository.security.ownedentity;

import com.gms.domain.security.ownedentity.EOwnedEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

import static com.gms.util.constant.ResourcePath.*;

/**
 * @author Asiel Leal Celdeiro | lealceldeiro@gmail.com
 * @version 0.1
 */
@SuppressWarnings("unused")
@RepositoryRestResource(collectionResourceRel = OWNED_ENTITY, path = OWNED_ENTITY)
public interface EOwnedEntityRepository extends PagingAndSortingRepository<EOwnedEntity, Long> {

    @RestResource(exported = false)
    EOwnedEntity findFirstByUsername(String username);

    @RestResource(path = OWNED_ENTITY_SEARCH_MULTI_LIKE, rel = OWNED_ENTITY_SEARCH_MULTI_LIKE)
    Page<EOwnedEntity> findByNameContainsIgnoreCaseOrUsernameContainsIgnoreCase(
            @Param(QUERY_NAME) String name, @Param(QUERY_USERNAME) String username, Pageable pageable
    );

    @RestResource(path = OWNED_ENTITY_SEARCH_MULTI, rel = OWNED_ENTITY_SEARCH_MULTI)
    Page<EOwnedEntity> findByNameEqualsOrUsernameEquals(
            @Param(QUERY_NAME) String name, @Param(QUERY_USERNAME) String username, Pageable pageable
    );

    @RestResource(path = OWNED_ENTITY_SEARCH_NAME_LIKE, rel = OWNED_ENTITY_SEARCH_NAME_LIKE)
    Page<EOwnedEntity> findByNameContainsIgnoreCase(@Param(QUERY_VALUE) String name, Pageable pageable);

    @RestResource(path = OWNED_ENTITY_SEARCH_NAME, rel = OWNED_ENTITY_SEARCH_NAME)
    Page<EOwnedEntity> findByNameEquals(@Param(QUERY_VALUE) String name, Pageable pageable);

    @RestResource(path = OWNED_ENTITY_SEARCH_USERNAME_LIKE, rel = OWNED_ENTITY_SEARCH_USERNAME_LIKE)
    Page<EOwnedEntity> findByUsernameContainsIgnoreCase(@Param(QUERY_VALUE) String username, Pageable pageable);

    @RestResource(path = OWNED_ENTITY_SEARCH_USERNAME, rel = OWNED_ENTITY_SEARCH_USERNAME)
    Page<EOwnedEntity> findByUsernameEquals(@Param(QUERY_VALUE) String username, Pageable pageable);

}
