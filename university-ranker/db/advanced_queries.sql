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

CREATE PROCEDURE GetEliteUniversities()
BEGIN
    (SELECT DISTINCT U.Name
    FROM Universities U JOIN Rankings R ON U.Name = R.University AND R.Year = 2024
    WHERE R.Ranking <= 25)

    UNION

    ((SELECT DISTINCT Name
    FROM Universities
    WHERE (TeachingScore >= 80 AND ResearchScore >= 80) OR 
          (EmployerScore >= 80 AND ResearchScore >= 80) OR 
          (EmployerScore >= 80 AND TeachingScore >= 80))

    INTERSECT

    (SELECT U.Name AS Name
    FROM Universities U
    JOIN OfferedSubjects OS ON U.Name = OS.University
    JOIN Subjects S ON OS.Subject = S.Name
    WHERE S.75_Salary > 80000
    GROUP BY U.Name
    HAVING COUNT(*) > 5));
END//

DELIMITER ;