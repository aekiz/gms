package com.gms.domain;

import lombok.Data;

import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.Version;
import java.io.Serializable;

/**
 * @author Asiel Leal Celdeiro | lealceldeiro@gmail.com
 * @version 0.1
 */
@Data
@MappedSuperclass
public class GmsEntity implements Serializable {

    @Id
    @GeneratedValue
    protected Long id;

    @Version
    protected Integer version;
}
