/**
 * implemented into class 'Address' !
 *
 * Location de type StreetAddress
 *
 * - options
 * - options.location.street
 * - options.location.number
 * - options.city // FIXME quel est son type d'objet ?
 *
 * ```
 * XSD
 * StreetAddress (balise xsd) :
 *   ex. <StreetAddress><Street>1 rue Marconi</Street></StreetAddress>
 *   attribute name="locator"
 *    element name="xls:Building"
 *    element ref="xls:Street"
 * ```
 *
 * FIXME on traite les attributs ?
 *
 * ```
 * template : "\
 * <StreetAddress>\n\
 *   STREET__ \n\
 *   BUILDING__\n\
 * </StreetAddress>"
 * ```
 *
 * @alias Gp.Formats.XLS.LocationUtilityService.StreetAddress
 *
 */
