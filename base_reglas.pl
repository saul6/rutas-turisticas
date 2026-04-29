% ============================================================
%  SISTEMA EXPERTO DE RUTAS TURÍSTICAS - MICHOACÁN
%  Fase 2: Reglas y Lógica de Consultas
%  Taller de Investigación II
% ============================================================
%  INSTRUCCIONES DE USO:
%  1. Asegúrate de tener base_conocimiento.pl en la misma carpeta
%  2. Carga este archivo con: swipl base_reglas.pl
%  3. El archivo carga automáticamente la base de conocimiento
% ============================================================

:- consult('base_conocimiento.pl').

% ============================================================
% SECCIÓN 1: CAMINO BIDIRECCIONAL
% camino(+Origen, +Destino, ?Distancia, ?Costo, ?Tipo)
% Las conexiones definidas en la base de conocimiento son
% unidireccionales, esta regla las hace bidireccionales.
% ============================================================

camino(A, B, D, C, T) :- conexion(A, B, D, C, T).
camino(A, B, D, C, T) :- conexion(B, A, D, C, T).

% ============================================================
% SECCIÓN 2: BÚSQUEDA DE RUTAS
% ============================================================

% ------------------------------------------------------------
% ruta(+Origen, +Destino, ?Ruta)
% Encuentra una ruta entre Origen y Destino.
% Ruta es una lista de lugares incluyendo origen y destino.
% Usa Visitados para evitar ciclos infinitos.
% ------------------------------------------------------------

ruta(Origen, Destino, Ruta) :-
    ruta_aux(Origen, Destino, [Origen], Ruta).

ruta_aux(Destino, Destino, Visitados, Ruta) :-
    reverse(Visitados, Ruta).

ruta_aux(Actual, Destino, Visitados, Ruta) :-
    camino(Actual, Siguiente, _, _, _),
    \+ member(Siguiente, Visitados),
    ruta_aux(Siguiente, Destino, [Siguiente|Visitados], Ruta).

% ------------------------------------------------------------
% ruta_con_costo(+Origen, +Destino, ?Ruta, ?CostoTotal, ?DistanciaTotal)
% Encuentra rutas con su costo y distancia acumulados.
% ------------------------------------------------------------

ruta_con_costo(Origen, Destino, Ruta, CostoTotal, DistanciaTotal) :-
    ruta_costo_aux(Origen, Destino, [Origen], Ruta, 0, CostoTotal, 0, DistanciaTotal).

ruta_costo_aux(Destino, Destino, Visitados, Ruta, C, C, D, D) :-
    reverse(Visitados, Ruta).

ruta_costo_aux(Actual, Destino, Visitados, Ruta, CAcc, CTotal, DAcc, DTotal) :-
    camino(Actual, Siguiente, Dist, Costo, _),
    \+ member(Siguiente, Visitados),
    CAcc1 is CAcc + Costo,
    DAcc1 is DAcc + Dist,
    ruta_costo_aux(Siguiente, Destino, [Siguiente|Visitados], Ruta, CAcc1, CTotal, DAcc1, DTotal).

% ============================================================
% SECCIÓN 3: MÉTRICAS - CLASIFICACIÓN DE RUTAS
% ============================================================

% ------------------------------------------------------------
% ruta_mas_corta(+Origen, +Destino, ?Ruta, ?Distancia)
% Encuentra la ruta con menor distancia total.
% ------------------------------------------------------------

ruta_mas_corta(Origen, Destino, MejorRuta, MenorDist) :-
    findall(D-R, ruta_con_costo(Origen, Destino, R, _, D), Lista),
    Lista \= [],
    min_member(MenorDist-MejorRuta, Lista).

% ------------------------------------------------------------
% ruta_mas_larga(+Origen, +Destino, ?Ruta, ?Distancia)
% Encuentra la ruta con mayor distancia total.
% ------------------------------------------------------------

ruta_mas_larga(Origen, Destino, MejorRuta, MayorDist) :-
    findall(D-R, ruta_con_costo(Origen, Destino, R, _, D), Lista),
    Lista \= [],
    max_member(MayorDist-MejorRuta, Lista).

% ------------------------------------------------------------
% ruta_mas_barata(+Origen, +Destino, ?Ruta, ?Costo)
% Encuentra la ruta con menor costo total de casetas.
% ------------------------------------------------------------

ruta_mas_barata(Origen, Destino, MejorRuta, MenorCosto) :-
    findall(C-R, ruta_con_costo(Origen, Destino, R, C, _), Lista),
    Lista \= [],
    min_member(MenorCosto-MejorRuta, Lista).

% ------------------------------------------------------------
% ruta_mas_cara(+Origen, +Destino, ?Ruta, ?Costo)
% Encuentra la ruta con mayor costo total de casetas.
% ------------------------------------------------------------

ruta_mas_cara(Origen, Destino, MejorRuta, MayorCosto) :-
    findall(C-R, ruta_con_costo(Origen, Destino, R, C, _), Lista),
    Lista \= [],
    max_member(MayorCosto-MejorRuta, Lista).

% ============================================================
% SECCIÓN 4: FILTROS DE RUTAS
% ============================================================

% ------------------------------------------------------------
% ruta_con_servicio(+Origen, +Destino, +Servicio, ?Ruta)
% Rutas que incluyan al menos un lugar con el servicio dado.
% Ejemplo: ruta_con_servicio(morelia, uruapan, gasolinera, R).
% ------------------------------------------------------------

ruta_con_servicio(Origen, Destino, Servicio, Ruta) :-
    ruta(Origen, Destino, Ruta),
    member(Lugar, Ruta),
    Lugar \= Origen,
    Lugar \= Destino,
    servicio(Lugar, Servicio).

% ------------------------------------------------------------
% ruta_con_gasolinera(+Origen, +Destino, ?Ruta)
% Atajo para rutas que pasen por una gasolinera.
% ------------------------------------------------------------

ruta_con_gasolinera(Origen, Destino, Ruta) :-
    ruta_con_servicio(Origen, Destino, gasolinera, Ruta).

% ------------------------------------------------------------
% ruta_turistica(+Origen, +Destino, ?Ruta)
% Rutas que pasen por al menos un lugar turístico.
% ------------------------------------------------------------

ruta_turistica(Origen, Destino, Ruta) :-
    ruta_con_servicio(Origen, Destino, turistico, Ruta).

% ------------------------------------------------------------
% ruta_por_tipo(+Origen, +Destino, +Tipo, ?Ruta)
% Rutas donde TODOS los tramos son del tipo indicado.
% Tipo: cuota | libre
% ------------------------------------------------------------

ruta_por_tipo(Origen, Destino, Tipo, Ruta) :-
    ruta(Origen, Destino, Ruta),
    todos_tramos_tipo(Ruta, Tipo).

todos_tramos_tipo([_], _).
todos_tramos_tipo([A, B | Resto], Tipo) :-
    camino(A, B, _, _, Tipo),
    todos_tramos_tipo([B | Resto], Tipo).

% ------------------------------------------------------------
% ruta_mixta(+Origen, +Destino, ?Ruta)
% Rutas que tengan tramos de cuota Y tramos libres.
% ------------------------------------------------------------

ruta_mixta(Origen, Destino, Ruta) :-
    ruta(Origen, Destino, Ruta),
    tiene_tramo_tipo(Ruta, cuota),
    tiene_tramo_tipo(Ruta, libre).

tiene_tramo_tipo([A, B | _], Tipo) :-
    camino(A, B, _, _, Tipo).
tiene_tramo_tipo([_ | Resto], Tipo) :-
    tiene_tramo_tipo(Resto, Tipo).

% ------------------------------------------------------------
% ruta_por_lugar(+Origen, +Destino, +PasaPor, ?Ruta)
% Rutas que obligatoriamente pasen por un lugar específico.
% Ejemplo: ruta_por_lugar(morelia, uruapan, patzcuaro, R).
% ------------------------------------------------------------

ruta_por_lugar(Origen, Destino, PasaPor, Ruta) :-
    ruta(Origen, Destino, Ruta),
    member(PasaPor, Ruta).

% ============================================================
% SECCIÓN 5: RESTRICCIONES POR PRESUPUESTO
% ============================================================

% ------------------------------------------------------------
% ruta_en_presupuesto(+Origen, +Destino, +Presupuesto, ?Ruta)
% Rutas cuyo costo total no supere el presupuesto dado.
% Ejemplo: ruta_en_presupuesto(morelia, lazaro_cardenas, 200, R).
% ------------------------------------------------------------

ruta_en_presupuesto(Origen, Destino, Presupuesto, Ruta) :-
    ruta_con_costo(Origen, Destino, Ruta, Costo, _),
    Costo =< Presupuesto.

% ------------------------------------------------------------
% ruta_en_rango_costo(+Origen, +Destino, +Min, +Max, ?Ruta)
% Rutas cuyo costo esté entre Min y Max pesos.
% Ejemplo: ruta_en_rango_costo(morelia, uruapan, 50, 200, R).
% ------------------------------------------------------------

ruta_en_rango_costo(Origen, Destino, Min, Max, Ruta) :-
    ruta_con_costo(Origen, Destino, Ruta, Costo, _),
    Costo >= Min,
    Costo =< Max.

% ============================================================
% SECCIÓN 6: CONSULTAS AVANZADAS
% ============================================================

% ------------------------------------------------------------
% todas_las_rutas(+Origen, +Destino, ?ListaRutas)
% Devuelve TODAS las rutas posibles entre dos puntos.
% Ejemplo: todas_las_rutas(morelia, uruapan, L).
% ------------------------------------------------------------

todas_las_rutas(Origen, Destino, ListaRutas) :-
    findall(Ruta, ruta(Origen, Destino, Ruta), ListaRutas).

% ------------------------------------------------------------
% ruta_con_n_turisticos(+Origen, +Destino, +N, ?Ruta)
% Rutas que pasen por al menos N lugares turísticos
% (sin contar origen ni destino).
% Ejemplo: ruta_con_n_turisticos(morelia, lazaro_cardenas, 2, R).
% ------------------------------------------------------------

ruta_con_n_turisticos(Origen, Destino, N, Ruta) :-
    ruta(Origen, Destino, Ruta),
    contar_turisticos(Ruta, Total),
    Total >= N.

contar_turisticos([], 0).
contar_turisticos([Lugar | Resto], Total) :-
    (servicio(Lugar, turistico) ->
        contar_turisticos(Resto, SubTotal),
        Total is SubTotal + 1
    ;
        contar_turisticos(Resto, Total)
    ).

% ------------------------------------------------------------
% ruta_optima(+Origen, +Destino, +Presupuesto, ?Ruta, ?Info)
% Ruta más corta dentro de un presupuesto dado.
% Info = info(Costo, Distancia)
% Ejemplo: ruta_optima(morelia, lazaro_cardenas, 300, R, I).
% ------------------------------------------------------------

ruta_optima(Origen, Destino, Presupuesto, MejorRuta, info(Costo, Dist)) :-
    findall(D-C-R,
        (ruta_con_costo(Origen, Destino, R, C, D), C =< Presupuesto),
        Lista),
    Lista \= [],
    min_member(_-Costo-MejorRuta, Lista),
    ruta_con_costo(Origen, Destino, MejorRuta, Costo, Dist).

% ------------------------------------------------------------
% resumen_ruta(+Ruta)
% Muestra información detallada de una ruta.
% Ejemplo: ruta(morelia, uruapan, R), resumen_ruta(R).
% ------------------------------------------------------------

resumen_ruta(Ruta) :-
    ruta_con_costo_lista(Ruta, Costo, Dist),
    length(Ruta, Len),
    Paradas is Len - 2,
    format("~n=== RESUMEN DE RUTA ===~n"),
    format("Recorrido: "),
    imprimir_ruta(Ruta),
    format("~nParadas intermedias: ~w~n", [Paradas]),
    format("Distancia total: ~w km~n", [Dist]),
    format("Costo total: $~w MXN~n", [Costo]),
    format("======================~n").

ruta_con_costo_lista([_], 0, 0).
ruta_con_costo_lista([A, B | Resto], CostoTotal, DistTotal) :-
    camino(A, B, Dist, Costo, _),
    ruta_con_costo_lista([B | Resto], CostoResto, DistResto),
    CostoTotal is Costo + CostoResto,
    DistTotal is Dist + DistResto.

imprimir_ruta([Ultimo]) :-
    format("~w", [Ultimo]).
imprimir_ruta([Lugar | Resto]) :-
    format("~w -> ", [Lugar]),
    imprimir_ruta(Resto).

% ============================================================
% FIN DE REGLAS - FASE 2
% ============================================================
% EJEMPLOS DE CONSULTAS:
%
% Rutas básicas:
%   ?- ruta(morelia, uruapan, R).
%   ?- ruta_con_costo(morelia, uruapan, R, C, D).
%
% Métricas:
%   ?- ruta_mas_corta(morelia, lazaro_cardenas, R, D).
%   ?- ruta_mas_barata(morelia, lazaro_cardenas, R, C).
%
% Filtros:
%   ?- ruta_turistica(morelia, uruapan, R).
%   ?- ruta_con_gasolinera(zamora, uruapan, R).
%   ?- ruta_por_tipo(morelia, patzcuaro, libre, R).
%   ?- ruta_por_lugar(morelia, uruapan, patzcuaro, R).
%
% Presupuesto:
%   ?- ruta_en_presupuesto(morelia, lazaro_cardenas, 200, R).
%   ?- ruta_en_rango_costo(morelia, uruapan, 0, 150, R).
%
% Avanzadas:
%   ?- todas_las_rutas(morelia, patzcuaro, L), length(L, N).
%   ?- ruta_con_n_turisticos(morelia, lazaro_cardenas, 2, R).
%   ?- ruta_optima(morelia, lazaro_cardenas, 300, R, I).
%   ?- ruta(morelia, uruapan, R), resumen_ruta(R).
% ============================================================