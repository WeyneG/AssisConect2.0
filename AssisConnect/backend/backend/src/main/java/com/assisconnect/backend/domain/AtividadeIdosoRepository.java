
package com.assisconnect.backend.domain;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AtividadeIdosoRepository extends JpaRepository<AtividadeIdoso, Long> {

    boolean existsByAtividade_IdAndIdoso_Id(Long atividadeId, Long idosoId);

    @Query("""
        select a
        from AtividadeIdoso ai
        join ai.atividade a
        where ai.idoso.id = :idosoId
        order by a.data asc, a.horario_inicio asc
    """)
    List<Atividade> findAtividadesByIdoso(@Param("idosoId") Long idosoId);

 
    @Modifying
    @Query("""
        delete from AtividadeIdoso ai
        where ai.atividade.id = :atividadeId and ai.idoso.id = :idosoId
    """)
    int deleteOne(@Param("atividadeId") Long atividadeId, @Param("idosoId") Long idosoId);

  
    @Modifying
    @Query("""
        delete from AtividadeIdoso ai
        where ai.atividade.id = :atividadeId and ai.idoso.id in :idosoIds
    """)
    int deleteAllByAtividadeAndIdosos(@Param("atividadeId") Long atividadeId,
                                      @Param("idosoIds") List<Long> idosoIds);
}
