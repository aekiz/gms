package com.gms.repository.security.permission;

import com.gms.domain.security.permission.BPermission;
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
@RepositoryRestResource(collectionResourceRel = PERMISSION, path = PERMISSION)
public interface BPermissionRepository extends PagingAndSortingRepository<BPermission, Long>, BPermissionRepositoryCustom {

    @Override
    @RestResource(exported = false)
    void deleteById(Long id);

    @Override
    @RestResource(exported = false)
    void delete(BPermission permission);

    @Override
    @RestResource(exported = false)
    <S extends BPermission> S save(S s);

    @Override
    @RestResource(exported = false)
    <S extends BPermission> Iterable<S> saveAll(Iterable<S> it);

    @RestResource(exported = false)
    BPermission findFirstByName(String name);

    @RestResource(path = PERMISSION_SEARCH_MULTI_LIKE, rel = PERMISSION_SEARCH_MULTI_LIKE)
    Page<BPermission> findByNameContainsIgnoreCaseOrLabelContainsIgnoreCase(
            @Param(QUERY_NAME) String name, @Param(QUERY_LABEL) String label, Pageable pageable
    );

    @RestResource(path = PERMISSION_SEARCH_MULTI, rel = PERMISSION_SEARCH_MULTI)
    Page<BPermission> findByNameEqualsOrLabelEquals(
            @Param(QUERY_NAME) String name, @Param(QUERY_LABEL) String label, Pageable pageable
    );

    @RestResource(path = PERMISSION_SEARCH_NAME_LIKE, rel = PERMISSION_SEARCH_NAME_LIKE)
    Page<BPermission> findByNameContainsIgnoreCase(@Param(QUERY_VALUE) String like, Pageable pageable);

    @RestResource(path = PERMISSION_SEARCH_NAME, rel = PERMISSION_SEARCH_NAME)
    Page<BPermission> findByNameEquals(@Param(QUERY_VALUE) String name, Pageable pageable);

    @RestResource(path = PERMISSION_SEARCH_LABEL_LIKE, rel = PERMISSION_SEARCH_LABEL_LIKE)
    Page<BPermission> findByLabelContainsIgnoreCase(@Param(QUERY_VALUE) String like, Pageable pageable);

    @RestResource(path = PERMISSION_SEARCH_LABEL, rel = PERMISSION_SEARCH_LABEL)
    Page<BPermission> findByLabelEquals(@Param(QUERY_VALUE) String label, Pageable pageable);

}
