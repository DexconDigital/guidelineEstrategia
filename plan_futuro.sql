ALTER TABLE `empresa` CHANGE `horizonte_noanios` `horizonte_noanios` VARCHAR(11) NULL DEFAULT NULL;
ALTER TABLE `estrategias` ADD `cmi` TEXT NULL DEFAULT NULL AFTER `cmi_objetivos`;