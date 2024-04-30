-- Trigger --
DELIMITER //

CREATE TRIGGER InsertFavoriteTrigger 
BEFORE INSERT ON Favorites
FOR EACH ROW
BEGIN
    DECLARE count INT;

    SET count = (SELECT FavoriteCount
        FROM Users 
        WHERE Username = NEW.Username);

    IF count >= 10 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot add more than 10 favorites. Limit reached.';
    ELSE
        UPDATE Users SET FavoriteCount = FavoriteCount + 1 WHERE Username = NEW.Username;
    END IF;
END//

DELIMITER ;

-- Stored Procedure --


-- Transaction --