export class EventsData {
    // KOLs Button Event 
         public static kolsButtonCategory = "KOL";
         public static kolsButtonAction = "ClickOnKOL";
         public static kolsButtonLabel = "KolClick";
    // Drugs Button Event 
         public static drugsButtonCategory = "Drugs";
         public static drugsButtonAction= "ClickOnDrugs";
         public static drugsButtonLabel= "DrugsClick";
    // Tracking Kol Analytics button
         public static kolsAnalyticsButtonCategory = "KOLAnalytics";
         public static kolsAnalyticsButtonAction = "ClickOnKOLAnalytics";
         public static kolsAnalyticsButtonLabel = "KOLAnalyticsClick";
    // Add Notes event
         public static addNoteCategory = "AddNote" ;
         public static addNoteAction ;  // Dynamic field
         public static addNoteLabel ; // Dynamic field
    // Bookmarks in KOLs
         public static KolsBookmarkCategory = "KOLs Bookmarked";
         public static KolsBookmarkAction ; // Dyamic field contains for which kol newstype is bookmark
         public static KolsBookmarkLabel ; // Dynamic field contains newstype from which the link is bookmark
    // Bookmarks in Drugs
         public static drugsBookmarkCategory = "Drugs Bookmarked";
         public static drugsBookmarkAction; // Dyamic field contains for which drug newstype is bookmark
         public static drugsBookmarkLabel; // Dynamic field contains newstype from which the link is bookmark
    // Tabs Clicked in Kols
         public static kolsTabsClickedCategory = "TabsClicked";
         public static kolsTabsClickedAction= "KOLs";
         public static kolsTabsClickedLabel; // Dynamic field contains news type 
         // Tabs Clicked in Drugs
         public static drugsTabsClickedCategory = "TabsClicked";
         public static drugsTabsClickedAction= "Drugs";
         public static drugsTabsClickedLabel; // Dynamic field contains news type 
    // Tracking # Links Clicked from Kols 
         public static kolsLinksClickedCategory = "KOLs Links Clicked";
         public static kolsLinksClickedAction; // Dynamic field contains Kol name for which the link is clicked
         public static kolsLinksClickedLabelNewsType; //Dynamic field contains news type and id of the clicked link
         public static kolsLinksClickedLabelItemId; //Dynamic field contains id of the clicked link
    // Tracking # Links Clicked from drugs
         public static drugsLinksClickedCategory = "Drugs Links Clicked";
         public static drugsLinksClickedAction; // Dynamic field contains drug name for which the link is clicked
         public static drugsLinksClickedLabelNewsType; //Dynamic field contains news type and id of the clicked link
         public static drugsLinksClickedLabelItemId; //Dynamic field contains id of the clicked link
    // Search Terms Tracking in Kols
         public static kolsSearchCategory = "KOLs Search";
         public static kolsSearchAction;// Dynamic field contains name of drug which was search
         public static kolsSearchLabel;  // Dynamic field contains search entity 
    // Search Terms Tracking in drugs
         public static drugsSearchCategory = "Drugs Search";
         public static drugsSearchAction; // Dynamic field contains name of drug which was search 
         public static drugsSearchLabel; // Dynamic field contains search entity
    // Tracking KOL Groups
         public static kolsGroupCategory = "Groups Tracking";
         public static kolsGroupNameAction = "Group name :";
         public static kolsGroupAddedByAction = "Added By:";
         public static kolsGroupCreatedByAction = "Created By :";
         public static kolsGroupCreatedNewGroupLabel= "Created New Group";
         public static kolsGroupKolNameLabel;  // Dynamic field contains kol name
    // Tracking calendar events kols
         public static kolsCalendarCategory = "CalendarEvent";
         public static kolsCalendarpAction; // Dynamic field contains kol name of kol for which calendar event occurs
         public static kolsCalendarNewsTypeLabel;  // Dynamic field which contains NewsType
         public static kolsCalendarItemIdLabel; // Dynamic field which contains event id of event
    } 