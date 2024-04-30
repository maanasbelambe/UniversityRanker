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

CREATE TRIGGER DeleteFavoriteTrigger
AFTER DELETE ON Favorites
FOR EACH ROW

BEGIN
    UPDATE Users SET FavoriteCount = FavoriteCount - 1 WHERE Username = OLD.Username;
END//

DELIMITER ;


-- Stored Procedure --
DELIMITER //

CREATE PROCEDURE GetTopUniversities (
    IN Username VARCHAR(50))
BEGIN
    SELECT DISTINCT U.Name
    FROM Universities U NATURAL JOIN Rankings R
    WHERE R.Ranking <= 10
    -- create query to get universities ranked in the top 25 --


    -- create query to get universities with 2 of 3 scores above 80 --
    -- union with universities that offer 5 subjects with more than 80000 75th salary --


-- Transaction --