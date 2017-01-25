(function(){
    
    var app = angular.module('utils.dbCreator', []);

app.factory( 'DataBaseCreator', function(){
        
            var database = {};
            
            database.script =
                [
                "DROP TABLE IF EXISTS Account;",
                "CREATE TABLE IF NOT EXISTS Account (" +
                    "id varchar PRIMARY KEY NOT NULL," +
                    "accountNumber varchar NOT NULL," +
                    "unit varchar," +
                    "enrolled integer NOT NULL," +
                    "settingsId integer NOT NULL," +
                    "personId integer NOT NULL," +
                    "serviceId integer," +
                    "FOREIGN KEY (settingsId) REFERENCES Settings (id)," +
                    "FOREIGN KEY (personId) REFERENCES Person (id)," +
                    "FOREIGN KEY (serviceId) REFERENCES Service (id)" +
                ");",
                "INSERT INTO Account (id, accountNumber,unit,enrolled,settingsId,personId,serviceId) VALUES ('574de764ee0c119a20a5cb8e', '4241-3700-0029-6481', '', 1, 1, 1, 2);",
                "INSERT INTO Account (id, accountNumber,unit,enrolled,settingsId,personId,serviceId) VALUES ('5756e00cc5c51e54255b269e', 'CTA00000000TEST001', '', 1, 2, 1, 1);",
                
                "INSERT INTO Account (id, accountNumber,unit,enrolled,settingsId,personId,serviceId) VALUES ('6756e00cc5c51e54255b269e', 'CTA00000000TEST002', '', 1, 5, 1, 3);",
                
                "DROP TABLE IF EXISTS Category;",            
                "CREATE TABLE IF NOT EXISTS Category (" +
                    "id integer PRIMARY KEY AUTOINCREMENT NOT NULL," +
                    "description text" +
                ");",
                "INSERT INTO Category (id,description) VALUES (1,'Mi Casa');",
                "INSERT INTO Category (id,description) VALUES (2,'Hijos');",
                "INSERT INTO Category (id,description) VALUES (3,'Trabajo');",
                "INSERT INTO Category (id,description) VALUES (4,'Pareja');",            
                "DROP TABLE IF EXISTS Company;",
                "CREATE TABLE IF NOT EXISTS Company (" +
                    "id integer PRIMARY KEY AUTOINCREMENT NOT NULL," +
                    "name text NOT NULL," +
                    "logo text," +
                    "address nvarchar" +
                ");",
                
                "INSERT INTO Company (id,name,logo, address) VALUES (45,'Agua Andina','http://mayco.cl/wp-content/uploads/2012/05/aguasandina.png', 'Yungay #213');",            
                "INSERT INTO Company (id,name,logo, address) VALUES (2,'Chile Extra','https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Logotipo_Chilectra.svg/480px-Logotipo_Chilectra.svg.png', 'Providencia #113');",
                "INSERT INTO Company (id,name,logo, address) VALUES (46,'Banco Guibo', 'https://pbs.twimg.com/profile_images/578695737590067200/9ZJnrM2d.png', 'Providencia #113');",            
                
                "DROP TABLE IF EXISTS Person;",
                "CREATE TABLE IF NOT EXISTS Person (" +
                    "id integer PRIMARY KEY AUTOINCREMENT NOT NULL," +
                    "email text NOT NULL," +
                    "fullName text," +
                    "dni nvarchar" +
                ");",
                "INSERT INTO Person (id,email,fullName,dni) VALUES (1,'josemanuel@gmail.com','','');",
                "INSERT INTO Person (id,email,fullName,dni) VALUES (2,'sagudo@gmail.com',NULL,NULL);",
                "DROP TABLE IF EXISTS Service;",
                "CREATE TABLE IF NOT EXISTS Service (" +
                    "id integer PRIMARY KEY AUTOINCREMENT NOT NULL," +
                    "idCompany integer NOT NULL," +
                    "description text," +
                    "category varchar NOT NULL," +
                    "FOREIGN KEY (idCompany) REFERENCES Company (id)" +
                ");",
                "INSERT INTO Service (id,idCompany,description,category) VALUES (1,45,'Servicio De Agua','Basico');",
                "INSERT INTO Service (id,idCompany,description,category) VALUES (2,2,'Servicio De Luz','Basico');",
                "INSERT INTO Service (id,idCompany,description,category) VALUES (3,46,'Servicio Bancario','Bancario');",
                "DROP TABLE IF EXISTS Settings;",
                "CREATE TABLE IF NOT EXISTS Settings (" +
                    "id varchar PRIMARY KEY NOT NULL," +
                    "alias nvarchar," +
                    "categoryId integer," +
                    "notification integer(1) NOT NULL DEFAULT(1)," +
                    "FOREIGN KEY (categoryId) REFERENCES Category (id)" +
                ");",

                "INSERT INTO `Settings` (`id`,`alias`,`categoryId`) VALUES (1,'Cuenta de la luz',1);",
                "INSERT INTO `Settings` (`id`,`alias`,`categoryId`) VALUES (2,'Cuenta del agua',1);",
                "INSERT INTO `Settings` (`id`,`alias`,`categoryId`) VALUES (3,'Agua 2',1);",
                "INSERT INTO `Settings` (`id`,`alias`,`categoryId`) VALUES (4,'Luz 2',1);",
                "INSERT INTO `Settings` (`id`,`alias`,`categoryId`) VALUES (5,'Banca Guibo',1);",
                "DROP TABLE IF EXISTS `Voucher`;",
                "CREATE TABLE IF NOT EXISTS Voucher (" +
                    "id integer PRIMARY KEY AUTOINCREMENT NOT NULL," +
      				"voucherCode varchar NOT NULL," +
                    "accountId varchar NOT NULL," +
                    "expirationDate integer NOT NULL," +
                    "emissionDate integer NOT NULL," +
                    "wasRead integer(1) NOT NULL DEFAULT(0)," +
                    "state char(1) NOT NULL DEFAULT('I')," +
                    "cost float NULL," +
                    "consumption float NULL," +
                    "nationalCost float NULL," +
                    "foreignCost float NULL," +
                    "FOREIGN KEY (accountId) REFERENCES Account (id)" +
                ");",
                
                "INSERT INTO `Voucher` (`id`, voucherCode ,`accountId`,`expirationDate`,`emissionDate`,`wasRead`,`state`,`cost`,`consumption`) VALUES (1,'12345678','574de764ee0c119a20a5cb8e',1464490800000,1462417200000,0,'I',8000,'70');",
                
                "INSERT INTO Voucher (id,voucherCode,accountId,expirationDate,emissionDate,wasRead,state,cost,consumption) VALUES (2,'12345678', '5756e00cc5c51e54255b269e',1464490800000,1462417200000,0,'I',10000,23);",
                "INSERT INTO Voucher (id,voucherCode,accountId,expirationDate,emissionDate,wasRead,state,cost,consumption) VALUES (3,'12345679', '5756e00cc5c51e54255b269e',1461898800000,1459825200000,0,'E',40000,103);",
                "INSERT INTO Voucher (id, voucherCode,accountId,expirationDate,emissionDate,wasRead,state,cost,consumption) VALUES (4,'12345680', '5756e00cc5c51e54255b269e',1459220400000,1457146800000,0,'E',20000,63);",
                "INSERT INTO Voucher (id,voucherCode,accountId,expirationDate,emissionDate,wasRead,state,cost,consumption) VALUES (5,'12345681', '5756e00cc5c51e54255b269e',1456714800000,1454641200000,0,'E',50000,43);",
                "INSERT INTO Voucher (id,voucherCode,accountId,expirationDate,emissionDate,wasRead,state,cost,consumption) VALUES (6,'12345682', '5756e00cc5c51e54255b269e',1454036400000,1451962800000,0,'E',30000,83);",
                "INSERT INTO Voucher (id,voucherCode,accountId,expirationDate,emissionDate,wasRead,state,cost,consumption) VALUES (7,'12345683', '5756e00cc5c51e54255b269e',1451358000000,1449284400000,0,'E',40000,53);",
                
                "INSERT INTO Voucher (id,voucherCode,accountId,expirationDate,emissionDate,wasRead,state,cost,consumption) VALUES (8,'12345684', '5756e00cc5c51e54255b269e',1464490800000,1462417200000,0, 'P',60000,53);",
                
                "INSERT INTO Voucher (id,voucherCode,accountId,expirationDate,emissionDate,wasRead,state,cost,consumption, nationalCost,  foreignCost) VALUES (9,'12345684', '6756e00cc5c51e54255b269e',1464490800000,1462417200000,0, 'I',0,0, 7000, 8000);",            
                
                "INSERT INTO Voucher (id,voucherCode,accountId,expirationDate,emissionDate,wasRead,state,cost,consumption, nationalCost,  foreignCost) VALUES (10,'12345684', '6756e00cc5c51e54255b269e',1461898800000,1459825200000,0, 'E',0,0, 1000, 4000);",            
                "INSERT INTO Voucher (id,voucherCode,accountId,expirationDate,emissionDate,wasRead,state,cost,consumption, nationalCost,  foreignCost) VALUES (11,'12345684', '6756e00cc5c51e54255b269e',1459220400000,1457146800000,0, 'E',0,0, 2000, 1000);",
                
                "DROP TABLE IF EXISTS VoucherDetail;",
                "CREATE TABLE IF NOT EXISTS VoucherDetail (" +
                    "id integer PRIMARY KEY AUTOINCREMENT NOT NULL," +
      				"voucherId varchar NOT NULL," +
                    "date integer NOT NULL," +
                    "cost float NULL," +
                    "consumption float NULL," +
                    "unit varchar," +
                    "description varchar," +
                    "type varchar," +
                    "cuota integer," +
                    "FOREIGN KEY (voucherId) REFERENCES Voucher (id)" +
                ");",
                
                "INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (1, 9, 1464490800000, 700, 700, '$', 'PRACTIKA CAFET AROMA INOX', 'INT');",
                "INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (2, 9, 1464490800000, 500, 500, '$', 'SUAVE P.HIGIENICO D.HOJA', 'INT');",
                "INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (3, 9, 1464490800000, 600, 600, '$', 'MUG DE COLORES DISEÑO ZIG ZAG', 'INT');",
                "INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (4, 9, 1464490800000, 200, 200, '$', 'MUG DE COLORES DISE?O ZIG ZAG', 'INT');",
                "INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (5, 9, 1464490800000, 500, 500, '$', 'JEAN SOGA DKDA03936', 'NAC');",
                "INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (6, 9, 1464490800000, 100, 100, '$', 'OTROS - DESCUENTOS', 'NAC');",
                
                "INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (7, 10, 1464490800000, 700, 700, '$', 'BICI MICKEY - CLUB', 'INT');",
                "INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (8, 10, 1464490800000, 500, 500, '$', 'SOMETHING SPEC WHISKY UN750CM3.', 'INT');",
                "INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (9, 10, 1464490800000, 600, 600, '$', 'SOMETHING SPEC WHISKY UN750CM3.', 'INT');",
                "INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (10, 10, 1464490800000, 200, 200, '$', 'BICI MICKEY - CLUB', 'INT');",
                "INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (11, 10, 1464490800000, 500, 500, '$', 'SOMETHING SPEC WHISKY UN750CM3.', 'NAC');",
                "INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (12, 10, 1464490800000, 100, 100, '$', 'BICI MICKEY - CLUB', 'NAC');",
                
                "INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (13, 11, 1464490800000, 700, 700, '$', 'AER-POL-POCKET1-PV15', 'INT');",
                "INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (14, 11, 1464490800000, 500, 500, '$', 'MDS-NK-POL-JERSEY', 'INT');",
                "INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (15, 11, 1464490800000, 600, 600, '$', 'FRIENDSHIP EGGS', 'INT');",
                "INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (16, 11, 1464490800000, 200, 200, '$', 'FRIENDSHIP EGGS', 'INT');",
                "INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (17, 11, 1464490800000, 500, 500, '$', 'MDS-NK-POL-JERSEY', 'NAC');",
                "INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (18, 11, 1464490800000, 100, 100, '$', 'MDS-NK-POL-JERSEY', 'NAC');",
            ];
        
        return database;
        
    });

})()