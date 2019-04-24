var MPMUTILS = {};

// Pre-2012 model "regions": (N.B. These really should be called "districts".)
MPMUTILS.modelRegions = [
["gd01","Downtown Boston E of Charles Street"],
["gd02","Back Bay and South End"],
["gd03","East Boston, Logan Airport"],
["gd04","Winthrop, Chelsea, Revere"],
["gd05","Charlestown, Malden, Medford, Everett"],
["gd06","Somerville"],
["gd07","Cambridge"],
["gd08","Brookline, Allston, Brighton"],
["gd09","Roxbury, Jamaica Plain, Roslindale (part), Mattapan (part)"],
["gd10","South Boston, Dorchester, Mattapan (part)"],
["gd11","Lynn, Saugus, Nahant"],
["gd12","Woburn, Stoneham, Winchester, Melrose, Wakefield"],
["gd13","Arlington, Belmont, Watertown"],
["gd14","Lexington, Waltham"],
["gd15","Newton"],
["gd16","Hyde Park, West Roxbury, Roslindale (part), Dedham"],
["gd17","Milton, Quincy"],
["gd18","Swampscott, Salem, Marblehead, Beverly, Wenham, Hamilton"],
["gd19","Lynnfield, Peabody, Danvers, Middleton, Topsfield, Boxford"],
["gd20","Reading, North Reading, Wilmington"],
["gd21","North Andover, Andover, Tewksbury"],
["gd22","Billerica, Burlington"],
["gd23","Acton, Carlisle, Maynard, Concord, Bedford, Lincoln"],
["gd24","Wayland, Weston, Natick, Wellesley, Needham, Dover"],
["gd25","Sudbury, Framingham, Ashland, Holliston, Sherborn"],
["gd26","Millis, Medfield, Westwood, Norwood, Norfolk, Walpole, Sharon"],
["gd27","Canton, Stoughton, Randolph, Avon, Holbrook"],
["gd28","Brockton, Whitman"],
["gd29","Braintree, Weymouth"],
["gd30","Abington, Rockland, Hanover, Norwell, Scituate, Hingham, Cohasset, Hull"],
["gd31","Rockport, Gloucester, Manchester, Essex, Ipswich, Rowley, Georgetown"],
["gd32","Salisbury, Amesbury, Merrimac, Newbury, Newburyport, West Newbury, Groveland"],
["gd33","Haverhill, Methuen, Lawrence"],
["gd34","Chelmsford, Lowell, Dracut, Tyngsborough, Dunstable"],
["gd35","Stow, Bolton, Boxborough, Littleton, Westford, Pepperell, Groton, Ayer, Harvard, Clinton, Lancaster, Shirley"],
["gd36","Hudson, Marlborough, Southborough, Hopkinton, Berlin, Northborough, Westborough, Upton, Northbridge"],
["gd37","Medway, Franklin, Bellingham, Milford, Hopedale, Mendon, Blackstone, Millville, Uxbridge"],
["gd38","Foxborough, Wrentham, Mansfield, Plainville, North Attleborough, Attleboro, Norton"],
["gd39","East Bridgewater, West Bridgewater, Easton, Bridgewater, Raynham,Taunton, Middleborough, Lakeville"],
["gd40","Marshfield, Duxbury, Plymouth, Pembroke, Hanson, Halifax, Kingston, Plympton, Carver"]
]; //  end MPMUTILS.modelRegions

// 2012 model regions: (Again, these really should be called "districts".)
MPMUTILS.modelRegions_2012 = [
["1","Downtown Boston E of Charles Street"],
["2","South Boston Seaport District"],
["3","Back Bay and South End"],
["4","East Boston, Logan Airport"],
["5","Winthrop, Chelsea, Revere"],
["6","Charlestown, Malden, Medford, Everett"],
["7","Somerville"],
["8","Cambridge"],
["9","Brookline, Allston, Brighton"],
["10","Roxbury, Jamaica Plain, Roslindale (part), Mattapan (part)"],
["11","South Boston, Dorchester, Mattapan (part)"],
["12","Lynn, Saugus, Nahant"],
["13","Woburn, Stoneham, Winchester, Melrose, Wakefield"],
["14","Arlington, Belmont, Watertown"],
["15","Lexington, Waltham"],
["16","Newton"],
["17","Hyde Park, West Roxbury, Roslindale (part), Dedham"],
["18","Milton, Quincy"],
["19","Swampscott, Salem, Marblehead, Beverly, Wenham, Hamilton"],
["20","Lynnfield, Peabody, Danvers, Middleton, Topsfield, Boxford"],
["21","Reading, North Reading, Wilmington"],
["22","North Andover, Andover, Tewksbury"],
["23","Billerica, Burlington"],
["24","Acton, Carlisle, Maynard, Concord, Bedford, Lincoln"],
["25","Wayland, Weston, Natick, Wellesley, Needham, Dover"],
["26","Sudbury, Framingham, Ashland, Holliston, Sherborn"],
["27","Millis, Medfield, Westwood, Norwood, Norfolk, Walpole, Sharon"],
["28","Canton, Stoughton, Randolph, Avon, Holbrook"],
["29","Brockton, Whitman"],
["30","Braintree, Weymouth"],
["31","Abington, Rockland, Hanover, Norwell, Scituate, Hingham, Cohasset, Hull"],
["32","Rockport, Gloucester, Manchester, Essex, Ipswich, Rowley, Georgetown"],
["33","Salisbury, Amesbury, Merrimac, Newbury, Newburyport, West Newbury, Groveland"],
["34","Haverhill, Methuen, Lawrence"],
["35","Chelmsford, Lowell, Dracut, Tyngsborough, Dunstable"],
["36","Stow, Bolton, Boxborough, Littleton, Westford, Pepperell, Groton, Ayer, Harvard, Clinton, Lancaster, Shirley"],
["37","Hudson, Marlborough, Southborough, Hopkinton, Berlin, Northborough, Westborough, Upton, Northbridge"],
["38","Medway, Franklin, Bellingham, Milford, Hopedale, Mendon, Blackstone, Millville, Uxbridge"],
["39","Foxborough, Wrentham, Mansfield, Plainville, North Attleborough, Attleboro, Norton"],
["40","East Bridgewater, West Bridgewater, Easton, Bridgewater, Raynham,Taunton, Middleborough, Lakeville"],
["41","Marshfield, Duxbury, Plymouth, Pembroke, Hanson, Halifax, Kingston, Plympton, Carver"]
]; //  end MPMUTILS.modelRegions_2012

// 'External' model regions, 2012: (Again, these really should be called "districts".)
MPMUTILS.externals_2012 = [
["51","North of Boston MPO (New Hampshire, etc.)"],
["52","West of Boston MPO (Central Mass and points west)"],
["53","Southwest of Boston MPO (Rhode Island, Connecticut, etc.)"],
["54","Southeast of Boston MPO (South Shore, Fall River-New Bedford, Cape Cod, etc.)"]
];  //  end MPMUTILS.externals_2012

// Keeping with MMcS's practice, this is an array-of-arrays rather than an array-of-objects.
// Indices for the sub-arrays are as follows:
// [0] - district number, e.g., 1
// [1] - district name, e.g., "gd01"
// {2] - string with list of towns/neighborhoods/whatever in the district
MPMUTILS.modelDistricts_2016 = [
[1, "gd01","Boston (Downtown East of Charles Street)"],
[2, "gd02","Boston (South Boston, Seaport District)"],
[3, "gd03","Boston (Back Bay and South End)"],
[4, "gd04","Boston (East Boston, Logan Airport)"],
[5, "gd05","Boston (Deer Island), Chelsea, Revere, Winthrop"],
[6, "gd06","Boston (Charlestown), Malden, Medford, Everett"],
[7, "gd07","Somerville"],
[8, "gd08","Cambridge"],
[9, "gd09","Boston (Allston, Cambridge), Brookline"],
[10, "gd10","Boston (Roxbury, Jamaica Plain, Roslindale (part), Mattapan (part))"],
[11, "gd11","Boston (South Boston, Dorchester, Mattapan (part))"],
[12, "gd12","Lynn, Nahant, Saugus"],
[13, "gd13","Melrose, Stoneham, Wakefield, Winchester, Woburn"],
[14, "gd14","Arlington, Belmont, Watertown"],
[15, "gd15","Lexington, Waltham"],
[16, "gd16","Newton"],
[17, "gd17","Boston (Hyde Park, West Roxbury, Roslindale (part)), Dedham"],
[18, "gd18","Boston (Harbor Islands), Milton, Quincy"],
[19, "gd19","Beverly, Hamilton, Marblehead, Salem, Swampscott, Wenham"],
[20, "gd20","Boxford, Danvers, Lynnfield, Middleton, Peabody, Topsfield"],
[21, "gd21","North Reading, Reading, Wilmington"],
[22, "gd22","Andover, North Andover, Tewksbury"],
[23, "gd23","Billerica, Burlington"],
[24, "gd24","Acton, Bedford, Carlisle, Concord, Lincoln, Maynard"],
[25, "gd25","Dover, Natick, Needham, Wayland, Wellesley, Weston"],
[26, "gd26","Ashland, Framingham, Holliston, Sherborn, Sudbury"],
[27, "gd27","Medfield, Millis, Norfolk, Norwood, Sharon, Walpole, Westwood"],
[28, "gd28","Canton, Holbrook, Randolph"],
[29, "gd29","Abington, Avon, Brockton, Whitman"],
[30, "gd30","Braintree, Weymouth"],
[31, "gd31","Cohasset, Hingham, Hull, Marshfield, Norwell, Rockland, Scituate"],
[32, "gd32","Essex, Georgetown, Gloucester, Ipswich, Manchester, Rockport, Rowley"],
[33, "gd33","Amesbury, Groveland, Merrimac, Newbury, Newburyport, Salisbury, West Newbury"],
[34, "gd34","Haverhill, Lawrence, Methuen"],
[35, "gd35","Chelmsford, Dracut, Dunstable, Lowell, Tyngsborough"],
[36, "gd36","Ayer, Bolton, Boxborough, Clinton, Groton, Harvard, Lancaster, Littleton, Pepperell, Shirley, Stow, Westford"],
[37, "gd37","Berlin, Hopkinton, Hudson, Marlborough, Northborough, Northbridge, Southborough, Upton, Westborough"],
[38, "gd38","Bellingham, Blackstone, Franklin, Hopedale, Medway, Mendon, Milford, Millville, Uxbridge"],
[39, "gd39","Attleboro, Foxborough, Mansfield, North Attleborough, Norton, Plainville, Wrentham"],
[40, "gd40","Bridgewater, East Bridgewater, Easton, Lakeville, Middleborough, Raynham, Stoughton, Taunton, West Bridgewater"],
[41, "gd41","Carver, Duxbury, Halifax, Hanover, Hanson, Kingston, Pembroke, Plymouth, Plympton"]
]; //  end MPMUTILS.modelDistricts_2016

MPMUTILS.externals_2016 = [
[51, "gd51","North of Boston MPO (New Hampshire, Maine, etc.)"],
[52, "gd52","West of Boston MPO (Central Massachusetts and points west)"],
[53, "gd53","Southwest of Boston MPO (Rhode Island, Connecticut, etc.)"],
[54, "gd54","Southeast of Boston MPO (South Shore, Fall River-New Bedford, Cape Cod, etc.)"]
];  //  end MPMUTILS.externals_2016

// 2012 O/D corridors:
//                  0          1              2               3                4                
//  Fields are:  INDEX   OD_CORRIDOR	CORRIDOR_NO	    CORRIDOR_TXT	OD_CORRIDOR_NAME
MPMUTILS.OD_corridors_2012 = [   
        [1,'OD_BOS',1,'1','Boston Business District'],
        [2,'OD_CEN',2,'2','Central Area'],
        [3,'OD_NE',3,'3','Northeast Corridor'],
        [4,'OD_N',4,'4','North Corridor'],
        [5,'OD_NW',5,'5','Northwest Corridor'],
        [6,'OD_W',6,'6','West Corridor'],
        [7,'OD_SW',7,'7','Southwest Corridor'],
        [8,'OD_SE',8,'8','Southeast Corridor'],
        [9,'OD_O_SE',9,'9','Ext. Southeast Corridor'],
        [10,'OD_O_SW',10,'10','Ext. Southwest Corridor'],
        [11,'OD_O_W',11,'11','Ext. West Corridor'],
        [12,'OD_O_NW',12,'12','Ext. Northwest Corridor'],
        [13,'OD_O_NE',13,'13','Ext. Northeast Corridor'],
        [14,'OD_O_N',14,'14','Ext. North Corridor']
]; //  end MPMUTILS.OD_corridors_2012

// 2016 O/D corridors:
//                  0          1              2               3                4                
//  Fields are:  INDEX   OD_CORRIDOR	CORRIDOR_NO	    CORRIDOR_TXT	OD_CORRIDOR_NAME
MPMUTILS.OD_corridors_2016 = [
        [1,'OD_BOS',1,'1','Boston Business District'],
        [2,'OD_CEN',2,'2','Central Area'],
        [3,'OD_NE',3,'3','Northeast Corridor'],
        [4,'OD_N',4,'4','North Corridor'],
        [5,'OD_NW',5,'5','Northwest Corridor'],
        [6,'OD_W',6,'6','West Corridor'],
        [7,'OD_SW',7,'7','Southwest Corridor'],
        [8,'OD_SE',8,'8','Southeast Corridor'],
        [9,'OD_O_SE',9,'9','Ext. Southeast Corridor'],
        [10,'OD_O_SW',10,'10','Ext. Southwest Corridor'],
        [11,'OD_O_W',11,'11','Ext. West Corridor'],
        [12,'OD_O_NW',12,'12','Ext. Northwest Corridor'],
        [13,'OD_O_NE',13,'13','Ext. Northeast Corridor'],
        [14,'OD_O_N',14,'14','Ext. North Corridor']
        // The following corridors are NOT listed in the drop-down combo box:
        /*
        ,[15, 'OD_O_STATEWIDE', 15, '15', "Outer towns in MPO 'statewide' model"],
         [16, 'OD_O_EXTERNAL', 16, '16', 'External to model area']
        */ 
]; // end MPMUTILS.OD_corridors_2016