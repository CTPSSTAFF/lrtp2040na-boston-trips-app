var MPMUTILS = {};

// Name of WMS & WFS servers addressable outside of CTPS firewall.
MPMUTILS.szExternalServerRoot = '/map';
MPMUTILS.szExternalWMSserverRoot = MPMUTILS.szExternalServerRoot + '/wms'; 
MPMUTILS.szExternalWFSserverRoot = MPMUTILS.szExternalServerRoot + '/wfs';

// Model Regions with Codes.
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
] //  end MPMUTILS.modelRegions

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
] //  end MPMUTILS.modelRegions_2012

MPMUTILS.externals_2012 = [
["51","North of Boston MPO (New Hampshire, etc.)"],
["52","West of Boston MPO (Central Mass and points west)"],
["53","Southwest of Boston MPO (Rhode Island, Connecticut, etc.)"],
["54","Southeast of Boston MPO (South Shore, Fall River-New Bedford, Cape Cod, etc.)"]
]  //  end MPMUTILS.externals_2012


//                  0          1              2               3                4                
//  Fields are:  INDEX   OD_CORRIDOR	CORRIDOR_NO	    CORRIDOR_TXT	OD_CORRIDOR_NAME
MPMUTILS.OD_corridors = [   
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
]       //  end MPMUTILS.OD_corridors
