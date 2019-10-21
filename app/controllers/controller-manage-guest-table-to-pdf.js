angular
    .module('weddingPlanner')
    .controller('manageGuestTableSorting', [ '$scope', function ( $scope ) {
		$scope.printTable = function($scope) {
			var myTableArray = [];
			$('.table-management__body').find('.table-management__row').each(function() {
				var arrayOfThisRow = [];
				var tableData = $(this).find('div:eq(0), .pdf-maker--firstname, .pdf-maker--surname, .pdf-maker--guestCount, .pdf-maker--children, .pdf-maker--membership, .pdf-maker--status, .pdf-maker--phone-number');
				if (tableData.length > 0) {
					tableData.each(function() { arrayOfThisRow.push($(this).text()); });
					myTableArray.push(arrayOfThisRow);
				}
			});
			var arrayJoin = myTableArray.join();
			var lp = [],
				firstName = [],
				surName = [],
				numberGust = [],
				children = [],
				membership = [],
				status = [],
				phoneNumber= [];
			for (var p in myTableArray) {
				lp.push(myTableArray[p][0]);
				firstName.push(myTableArray[p][1]);
				surName.push(myTableArray[p][2]);
				numberGust.push(myTableArray[p][3]);
				children.push(myTableArray[p][4]);
				membership.push(myTableArray[p][5]);
				status.push(myTableArray[p][6]);
				phoneNumber.push(myTableArray[p][7]);
			}

			var docDefinition = {
			  pageOrientation: 'landscape',
			  pageSize: 'A4',
			  info: {
				  title: "Wedding Planner - lista gości",
				  author: "Administrator"
			  },
			  footer: function(currentPage, pageCount) {
				  return {
					  text: "Strona " + currentPage.toString() + ' z ' + pageCount,
					  alignment: "center"
				  }
			  },
			  content: [
				  {
					  stack: [
						  {text: "Tabela generyczna - Twoja lista gości", style: "tableHeader"},
						  {text: "- przedstawione wyniki uzależnione są od aktualnego ustawienia filtrowania", style: "tableSubheader"}
					  ]
				  },
				  {
					  table: {
						  widths: ["auto","auto","auto","auto","auto","auto", "auto", "auto"],
					body: [
					  [
						[{text: "L.P", style: "tHead"}, lp],
						[{text: "Imię", style: "tHead"}, firstName],
						[{text: "Nazwisko", style: "tHead"}, surName],
						[{text: "L. gości", style: "tHead"}, numberGust],
						[{text: "L. dzieci", style: "tHead"}, children],
						[{text: "Przyna.", style: "tHead"}, membership],
						[{text: "Status", style: "tHead"}, status],
						[{text: "tel.", style: "tHead"}, phoneNumber]
					  ]
					]
				  }
				}
			],
			styles: {
				tableHeader: {
					bold: true,
					fontSize: 12,
					lineHeight: 1,
					margin: [0,0,0,5]
				},
				tableSubheader: {
					margin: [0,0,0,50],
					lineHeight: 1
				},
				tHead: {
					bold: true
				}
			},
			defaultStyle: {
				lineHeight: 2,
				fontSize: 10
			}
			};

			  pdfMake.createPdf(docDefinition).print();

		}
    }]);
