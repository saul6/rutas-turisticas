% ============================================================
%  SISTEMA EXPERTO DE RUTAS TURÍSTICAS - MICHOACÁN
%  Fase 1: Base de Conocimiento
%  Taller de Investigación II
% ============================================================
 
% ------------------------------------------------------------
% SECCIÓN 1: LUGARES
% lugar(+Nombre)
% Define cada ciudad o punto de interés del sistema.
% ------------------------------------------------------------
 
lugar(morelia).
lugar(patzcuaro).
lugar(uruapan).
lugar(zamora).
lugar(zitacuaro).
lugar(lazaro_cardenas).
lugar(apatzingan).
lugar(sahuayo).
lugar(jacona).
lugar(tacambaro).
lugar(tingambato).
lugar(santa_clara_del_cobre).
lugar(tzintzuntzan).
 
% ------------------------------------------------------------
% SECCIÓN 2: CONEXIONES
% conexion(+Origen, +Destino, +DistanciaKm, +CostoPesos, +TipoCamino)
%
% TipoCamino: cuota | libre | mixta
% Las conexiones son bidireccionales (ver regla camino/5 en Fase 2)
% Distancias y costos aproximados reales de Michoacán
% ------------------------------------------------------------
 
% --- Desde Morelia ---
conexion(morelia, patzcuaro,       60,   0,   libre).
conexion(morelia, zamora,         170, 180,   cuota).
conexion(morelia, zitacuaro,      130,  90,   cuota).
conexion(morelia, uruapan,        120, 130,   cuota).
conexion(morelia, sahuayo,        190, 200,   cuota).
conexion(morelia, tzintzuntzan,    55,   0,   libre).
 
% --- Desde Pátzcuaro ---
conexion(patzcuaro, uruapan,       60,   0,   libre).
conexion(patzcuaro, santa_clara_del_cobre, 15, 0, libre).
conexion(patzcuaro, tzintzuntzan,  15,   0,   libre).
conexion(patzcuaro, tingambato,    35,   0,   libre).
conexion(patzcuaro, tacambaro,     45,   0,   libre).
 
% --- Desde Uruapan ---
conexion(uruapan, apatzingan,     100,   0,   libre).
conexion(uruapan, lazaro_cardenas,240, 160,   mixta).
conexion(uruapan, tingambato,      25,   0,   libre).
 
% --- Desde Zamora ---
conexion(zamora, sahuayo,          25,   0,   libre).
conexion(zamora, jacona,           10,   0,   libre).
 
% --- Desde Zitácuaro ---
conexion(zitacuaro, tacambaro,     90,   0,   libre).
 
% --- Desde Apatzingán ---
conexion(apatzingan, lazaro_cardenas, 180, 0, libre).
 
% --- Desde Sahuayo ---
conexion(sahuayo, jacona,          35,   0,   libre).
 
% ------------------------------------------------------------
% SECCIÓN 3: SERVICIOS
% servicio(+Lugar, +TipoServicio)
%
% TipoServicio: gasolinera | paradero | turistico | hotel | restaurante
% Un lugar puede tener múltiples servicios (un hecho por cada uno)
% ------------------------------------------------------------
 
% Morelia
servicio(morelia, turistico).
servicio(morelia, gasolinera).
servicio(morelia, hotel).
servicio(morelia, restaurante).
servicio(morelia, paradero).
 
% Pátzcuaro
servicio(patzcuaro, turistico).
servicio(patzcuaro, gasolinera).
servicio(patzcuaro, hotel).
servicio(patzcuaro, restaurante).
servicio(patzcuaro, paradero).
 
% Uruapan
servicio(uruapan, turistico).
servicio(uruapan, gasolinera).
servicio(uruapan, hotel).
servicio(uruapan, restaurante).
servicio(uruapan, paradero).
 
% Zamora
servicio(zamora, gasolinera).
servicio(zamora, hotel).
servicio(zamora, restaurante).
servicio(zamora, paradero).
 
% Zitácuaro
servicio(zitacuaro, turistico).
servicio(zitacuaro, gasolinera).
servicio(zitacuaro, hotel).
servicio(zitacuaro, restaurante).
 
% Lázaro Cárdenas
servicio(lazaro_cardenas, gasolinera).
servicio(lazaro_cardenas, hotel).
servicio(lazaro_cardenas, restaurante).
servicio(lazaro_cardenas, paradero).
servicio(lazaro_cardenas, turistico).
 
% Apatzingán
servicio(apatzingan, gasolinera).
servicio(apatzingan, hotel).
servicio(apatzingan, restaurante).
 
% Sahuayo
servicio(sahuayo, gasolinera).
servicio(sahuayo, hotel).
servicio(sahuayo, restaurante).
 
% Jacona
servicio(jacona, restaurante).
servicio(jacona, paradero).
 
% Tacámbaro
servicio(tacambaro, turistico).
servicio(tacambaro, restaurante).
 
% Tingambato
servicio(tingambato, turistico).
servicio(tingambato, paradero).
 
% Santa Clara del Cobre
servicio(santa_clara_del_cobre, turistico).
servicio(santa_clara_del_cobre, restaurante).
 
% Tzintzuntzan
servicio(tzintzuntzan, turistico).
servicio(tzintzuntzan, restaurante).
 
% ------------------------------------------------------------
% SECCIÓN 4: METADATOS DE LUGARES (info adicional)
% descripcion(+Lugar, +Texto)
% region(+Lugar, +Region)  -- para agrupar geográficamente
% ------------------------------------------------------------
 
descripcion(morelia,              'Capital del estado, Patrimonio de la Humanidad UNESCO').
descripcion(patzcuaro,            'Ciudad colonial orillas del lago, Pueblo Mágico').
descripcion(uruapan,              'Ciudad de la eterna primavera, cascada Tzararacua').
descripcion(zamora,               'Ciudad agroindustrial, catedral inconclusa').
descripcion(zitacuaro,            'Santuario de la Mariposa Monarca cercano').
descripcion(lazaro_cardenas,      'Puerto industrial en el Pacífico').
descripcion(apatzingan,           'Cuna de la Constitución de Apatzingán 1814').
descripcion(sahuayo,              'Importante centro comercial de la Ciénega').
descripcion(jacona,               'Ciudad hermana de Zamora, zona agrícola').
descripcion(tacambaro,            'Pueblo colonial con arquitectura virreinal').
descripcion(tingambato,           'Zona arqueológica prehispánica').
descripcion(santa_clara_del_cobre,'Pueblo Mágico, artesanías en cobre').
descripcion(tzintzuntzan,         'Antigua capital purépecha, Pueblo Mágico').
 
region(morelia,              'Valles Centrales').
region(patzcuaro,            'Lago de Pátzcuaro').
region(uruapan,              'Meseta Purépecha').
region(zamora,               'Ciénega de Chapala').
region(zitacuaro,            'Oriente').
region(lazaro_cardenas,      'Costa').
region(apatzingan,           'Tierra Caliente').
region(sahuayo,              'Ciénega de Chapala').
region(jacona,               'Ciénega de Chapala').
region(tacambaro,            'Valles Centrales').
region(tingambato,           'Meseta Purépecha').
region(santa_clara_del_cobre,'Lago de Pátzcuaro').
region(tzintzuntzan,         'Lago de Pátzcuaro').
 
% ============================================================
% FIN DE LA BASE DE CONOCIMIENTO - FASE 1
% Siguiente: base_reglas.pl (Fase 2 - Reglas y consultas)
% ============================================================
 