-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Dec 11, 2016 at 11:58 AM
-- Server version: 10.0.27-MariaDB-0ubuntu0.16.04.1
-- PHP Version: 7.0.8-0ubuntu0.16.04.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `Database`
--

-- --------------------------------------------------------

--
-- Table structure for table `papers`
--

CREATE TABLE `papers` (
  `Paper_ID` int(11) NOT NULL,
  `Title` tinytext,
  `PDF` longblob,
  `Authors` tinytext,
  `Venue` varchar(50) DEFAULT NULL,
  `Citations` int(11) DEFAULT NULL,
  `Year_Published` year(4) DEFAULT NULL,
  `Keywords` text,
  `BibTeX` mediumtext,
  `Summary` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `project`
--

CREATE TABLE `project` (
  `Project_ID` int(11) NOT NULL,
  `Title` tinytext,
  `Description` text,
  `Target_Deadline` date DEFAULT NULL,
  `Target_Venue` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `project-paper`
--

CREATE TABLE `project-paper` (
  `Project_ID` int(11) DEFAULT NULL,
  `Paper_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `project-reviewer`
--

CREATE TABLE `project-reviewer` (
  `Project_ID` int(11) DEFAULT NULL,
  `Reviewer_ID` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `reviewer`
--

CREATE TABLE `reviewer` (
  `Reviewer_ID` int(11) NOT NULL,
  `Name` varchar(50) DEFAULT NULL,
  `Email` tinytext,
  `Position` varchar(20) DEFAULT NULL,
  `Username` varchar(20) DEFAULT NULL,
  `Password_Hash` varchar(40) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `papers`
--
ALTER TABLE `papers`
  ADD PRIMARY KEY (`Paper_ID`);

--
-- Indexes for table `project`
--
ALTER TABLE `project`
  ADD PRIMARY KEY (`Project_ID`);

--
-- Indexes for table `project-paper`
--
ALTER TABLE `project-paper`
  ADD KEY `Project_ID2` (`Project_ID`),
  ADD KEY `Paper_ID2` (`Paper_ID`);

--
-- Indexes for table `project-reviewer`
--
ALTER TABLE `project-reviewer`
  ADD UNIQUE KEY `Project_ID_2` (`Project_ID`,`Reviewer_ID`),
  ADD KEY `Project_ID` (`Project_ID`),
  ADD KEY `Reviewer_ID` (`Reviewer_ID`);

--
-- Indexes for table `reviewer`
--
ALTER TABLE `reviewer`
  ADD PRIMARY KEY (`Reviewer_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `papers`
--
ALTER TABLE `papers`
  MODIFY `Paper_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `project`
--
ALTER TABLE `project`
  MODIFY `Project_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;
--
-- AUTO_INCREMENT for table `reviewer`
--
ALTER TABLE `reviewer`
  MODIFY `Reviewer_ID` int(11) NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `project-paper`
--
ALTER TABLE `project-paper`
  ADD CONSTRAINT `Paper_ID2` FOREIGN KEY (`Paper_ID`) REFERENCES `papers` (`Paper_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Project_ID2` FOREIGN KEY (`Project_ID`) REFERENCES `project` (`Project_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `project-reviewer`
--
ALTER TABLE `project-reviewer`
  ADD CONSTRAINT `Project_ID` FOREIGN KEY (`Project_ID`) REFERENCES `project` (`Project_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
